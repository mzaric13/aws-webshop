import json
import boto3
import psycopg2
from psycopg2 import sql
import paypalrestsdk
from paypalrestsdk import Sale

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

def refund_money(client_id, client_secret, payment_id, price):
    paypalrestsdk.configure({
        "mode": "sandbox",
        "client_id": client_id,
        "client_secret": client_secret
    })
    try:
        payment = paypalrestsdk.Payment.find(payment_id)
        if payment['state'] == "approved":
            sale_id = payment.transactions[0].related_resources[0].sale.id
            sale = Sale.find(sale_id)
            refund = sale.refund({
                "amount": {
                    "total": "{:.2f}".format(price),
                    "currency": "USD"
                }
            })
            if refund.success():
                return True
            else:
                return False
        else:
            return False
    except Exception as e:
        return False
    

def update_order(conn, order_id, status_id):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE orders SET status_id = %s WHERE id = %s RETURNING price, payment_id")
        cursor.execute(update_query, (status_id, order_id,))
        returned_rows = cursor.fetchall()
        for row in returned_rows:
            price, payment_id = row
        conn.commit()
        cursor.close()
        return price, payment_id
    except Exception as e:
        return False, False
        
def send_email(order_id, status):
    try:
        response = lambda_client.invoke(
            FunctionName='arn:aws:lambda:eu-north-1:232513253020:function:SendOrderStatusEmail',
            InvocationType='RequestResponse',
            Payload=json.dumps({'orderId': order_id, 'currentStatus': status})
        )
        json_data = json.loads(response['Payload'].read())
        return json_data
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_paypal = eval(get_secrets_manager_credentials("dev/WebShop/PayPalNewCred"))
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db and secret_string_paypal:
        order_id = event["orderId"]
        status_id = event["statusId"]
        status_name = event["statusName"]
        connection = get_connection(secret_string_db)
        price, payment_id = update_order(connection, order_id, status_id)
        if price != False:
            connection.close()
            send_email(order_id, status_name)
            if status_name == "DECLINED":
                status = refund_money(secret_string_paypal['PayPalCLiendID'], secret_string_paypal['PayPalClientSecret'], payment_id, price)
                if status:
                    return {
                        'statusCode': 200,
                        'body': "Successfully changed order status"
                    }
                else:
                    return {
                        'statusCode': 500,
                        'body': "Erro refunding mone"
                    }
            return {
                'statusCode': 200,
                'body': "Successfully changed order status"
            }
        else:
            connection.close()
            return {
                'statusCode': 500,
                'body': 'Error updating order in database'
            }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials for database'
        }