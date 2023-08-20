import json
import boto3
import psycopg2
from psycopg2 import sql
import paypalrestsdk
from paypalrestsdk import Payment

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')
lambda_client = boto3.client('lambda', region_name='eu-north-1')

def get_secrets_manager_credentials(secret_name):
    try:
        response = secrets_manager_client.get_secret_value(SecretId=secret_name)
        secret_string = response['SecretString']
        return secret_string
    except Exception as e:
        return None
    
def get_connection(secret_string):
    credentials = eval(secret_string)
    conn = psycopg2.connect(
        host=credentials['host'],
        port=credentials['port'],
        dbname=credentials['dbname'],
        user=credentials['username'],
        password=credentials['password']
    )
    return conn

def execute_payment(client_id, client_secret, payment_id, payer_id, token):
    paypalrestsdk.configure({
        "mode": "sandbox",  
        "client_id": client_id,
        "client_secret": client_secret
    })
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        payment = Payment.find(payment_id)
        #if payment['state'] == 'approved':
        #    return True, ""
        #else:
        if payment.execute({"payer_id": payer_id}):
            return True, "approved"
        else:
            return False, "Error executing payment"
    except Exception as  e:
        return False, "Error with payment"
        
def update_order(conn, order_id, payment_id):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE orders SET status_id = 2, payment_id = %s WHERE id = %s")
        cursor.execute(update_query, (payment_id, order_id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
        
def send_email(order_id):
    try:
        response = lambda_client.invoke(
            FunctionName='arn:aws:lambda:eu-north-1:232513253020:function:SendOrderStatusEmail',
            InvocationType='RequestResponse',
            Payload=json.dumps({'orderId': order_id, 'currentStatus': 'ACCEPTED'})
        )
        json_data = json.loads(response['Payload'].read())
        return json_data
    except Exception as e:
        return False
    
    
def lambda_handler(event, context):
    secret_string_paypal = eval(get_secrets_manager_credentials("dev/WebShop/PayPalNewCred"))
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_paypal and secret_string_db:
        order_id = event["pathParameters"]["orderId"]
        payment_id = event["queryStringParameters"]['paymentId']
        payer_id = event["queryStringParameters"]['PayerID']
        token = event["queryStringParameters"]['token']
        status, mess = execute_payment(secret_string_paypal['PayPalCLiendID'], secret_string_paypal['PayPalClientSecret'], payment_id, payer_id, token)
        if status:
            connection = get_connection(secret_string_db)
            if update_order(connection, int(order_id), payment_id):
                connection.close()
                send_email(order_id)
                return {
                    'statusCode': 200,
                    'body': mess,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            else:
                connection.close()
                return {
                    'statusCode': 500,
                    'body': 'Error updating order in database',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
        else:
            return {
                'statusCode': 500,
                'body': mess,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials for paypalapp and database',
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }