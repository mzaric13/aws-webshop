import json
import boto3
import psycopg2
from psycopg2 import sql

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class ReturnItem:
    def __init__(self, id: int, name: str, description: str, pictures, price, item_type_id, brand_id):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.item_type_id = item_type_id
        self.brand_id = brand_id
        # TODO
        self.pictures = pictures

    def to_json(self):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'brandId': self.brand_id,
            'itemTypeId': self.item_type_id
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

def get_item(conn, item_id):
    try:
        query = sql.SQL("SELECT DISTINCT it.id, it.name, it.description, pli.price, it.item_type_id, it.brand_id FROM items it INNER JOIN item_tags it_tg ON it.id = it_tg.item_id INNER JOIN tags tg ON it_tg.tag_id = tg.id INNER JOIN brands bd ON it.brand_id = bd.id INNER JOIN price_list_items pli ON pli.item_id = it.id INNER JOIN price_lists_item plsi ON pli.id = plsi.price_list_item_id INNER JOIN price_lists pl ON pl.id = plsi.price_list_id WHERE pl.valid = true and it.id = %s")
        cursor = conn.cursor()
        cursor.execute(query, (item_id,))
        item = cursor.fetchone()
        cursor.close()
        return item
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False
    
def transform_item(data):
    item = ReturnItem(int(data[0]), data[1], data[2], [], float(data[3]), int(data[4]), int(data[5]))
    return item.to_json()

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        item = get_item(connection, int(event['id']))
        connection.close()
        if item == False:
            return {
                'statusCode': 500,
                'body': 'Error reading brands from database'
            }
        return {
            'statusCode': 200,
            'body': transform_item(item)
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }