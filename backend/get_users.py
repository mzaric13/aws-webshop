import json
import boto3
import psycopg2
from datetime import datetime

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class User:
    def __init__(self, email, given_name, family_name, address, phone_number, birthdate):
        self.email = email
        self.given_name = given_name
        self.family_name = family_name
        self.address = address
        self.phone_number = phone_number
        self.birthdate = birthdate   

    def to_json(self):
        data = {
            'email': self.email,
            'given_name': self.given_name,
            'family_name': self.family_name,
            'address': self.address,
            'phone_number': self.phone_number,
            'birthdate': self.birthdate.isoformat()
        }
        return data

def convert_user(user):
    return User(user[3], user[4], user[5], user[1], user[6], user[2])

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

def collect_users(conn, page_number, page_size):
    offset = (page_number - 1) * page_size
    query = f"SELECT * FROM users ORDER BY id LIMIT {page_size} OFFSET {offset};"
    cursor = conn.cursor()
    cursor.execute(query)
    items = cursor.fetchall()
    cursor.close()
    return items

def transform_items(items):
    users = []
    for item in items:
        u = convert_user(item)
        users.append(u.to_json())
    return users

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        users = collect_users(connection, event['page_number'], event['page_size'])
        connection.close()
        users = transform_items(users)
        return {
            'statusCode': 200,
            'body': json.dumps(users)
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }
