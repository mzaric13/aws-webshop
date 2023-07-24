import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class Brand:
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

def collect_brands(conn):
    try:
        query = "SELECT * FROM brands;"
        cursor = conn.cursor()
        cursor.execute(query)
        items = cursor.fetchall()
        cursor.close()
        return items
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False

def transform_tags(data):
    brands = []
    for brand in data:
        b = Brand(int(brand[0]), brand[1])
        brands.append(b.to_json())
    return brands

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        brands = collect_brands(connection)
        connection.close()
        if brands == False:
            return {
                'statusCode': 500,
                'body': json.dumps('Error reading brands from database')
            }
        return {
            'statusCode': 200,
            'body': json.dumps(transform_tags(brands))
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }