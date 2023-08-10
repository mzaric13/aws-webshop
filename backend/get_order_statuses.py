import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class OrderStatus:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def to_json(self):
        data = {
            'id': self.id,
            'name': self.name
        }
        return data

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

def collect_order_statuses(conn):
    try:
        query = "SELECT * FROM order_statuses;"
        cursor = conn.cursor()
        cursor.execute(query)
        order_statuses = cursor.fetchall()
        cursor.close()
        return order_statuses
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False

def transform_statuses(data):
    statuses = []
    for status in data:
        s = OrderStatus(int(status[0]), status[1])
        statuses.append(s.to_json())
    return statuses

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        order_statuses = collect_order_statuses(connection)
        connection.close()
        if order_statuses == False:
            return {
                'statusCode': 500,
                'body': 'Error reading brands from database'
            }
        return {
            'statusCode': 200,
            'body': transform_statuses(order_statuses)
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }