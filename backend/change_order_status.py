import json
import boto3
import psycopg2
from psycopg2 import sql
import paypalrestsdk
from paypalrestsdk import Payment

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

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

def update_order(conn, order_id, status_id):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE orders SET status_id = %s WHERE id = %s")
        cursor.execute(update_query, (status_id, order_id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        order_id = event["orderId"]
        status_id = event["statusId"]
        connection = get_connection(secret_string_db)
        status = update_order(connection, order_id, status_id)
        if status:
            connection.close()
            return {
                'statusCode': 200,
                'body': "Order status successfully changed"
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