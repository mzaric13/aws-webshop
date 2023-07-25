import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class Tag:
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

    def to_json(self):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description
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

def collect_tags(conn):
    query = "SELECT * FROM tags;"
    cursor = conn.cursor()
    cursor.execute(query)
    items = cursor.fetchall()
    cursor.close()
    return items

def transform_tags(data):
    tags = []
    for tag in data:
        t = Tag(int(tag[0]), tag[1], tag[2])
        tags.append(t.to_json())
    return tags

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        tags = collect_tags(connection)
        connection.close()
        return {
            'statusCode': 200,
            'body': json.dumps(transform_tags(tags))
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }