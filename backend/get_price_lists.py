import json
import boto3
import psycopg2
from psycopg2 import sql
from datetime import datetime

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class PriceList:
    def __init__(self, id, valid, valid_from, valid_to, price_list_items):
        self.id = id
        self.valid = valid
        self.valid_from = valid_from
        self.valid_to = valid_to
        self.price_list_items = price_list_items

    def to_json(self):
        price_list_items = list(map(lambda x: x.to_json(), self.price_list_items))
        data = {
            'id': self.id,
            'valid': self.valid,
            'validFrom': self.valid_from.isoformat(),
            'validTo': self.valid_to.isoformat(),
            'priceListItems': price_list_items
        }
        return data
    
class PriceListItem:
    def __init__(self, item_id, item_name, price ) -> None:
        self.item_id = item_id
        self.item_name = item_name
        self.price = price

    def to_json(self):
        data = {
            'itemId': self.item_id,
            'itemName': self.item_name,
            'price': self.price,
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

def get_price_lists(conn):
    try:
        query = sql.SQL("SELECT pls.id, pls.valid, pls.valid_from, pls.valid_to, json_agg(json_build_object('item_id', pli.item_id, 'price', pli.price, 'item_name', it.name)) FROM price_lists pls INNER JOIN price_lists_item plsi ON pls.id = plsi.price_list_id INNER JOIN price_list_items pli ON plsi.price_list_item_id = pli.id INNER JOIN items it ON pli.item_id = it.id GROUP BY pls.id, pls.valid, pls.valid_from, pls.valid_to")
        cursor = conn.cursor()
        cursor.execute(query)
        order_statuses = cursor.fetchall()
        cursor.close()
        return order_statuses
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def transform_price_lists(price_lists_db):
    price_lists = []
    for price_list_db in price_lists_db:
        price_list_items = []
        for price_list_item_db in price_list_db[4]:
            price_list_items.append(PriceListItem(price_list_item_db['item_id'], price_list_item_db['item_name'], price_list_item_db['price']))
        price_list = PriceList(price_list_db[0], price_list_db[1], price_list_db[2], price_list_db[3], price_list_items)
        price_lists.append(price_list.to_json())
    return price_lists
    

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        price_lists_db = get_price_lists(connection)
        connection.close()
        if price_lists_db == False:
            return {
                'statusCode': 500,
                'body': 'Error reading price lists from database'
            }
        return {
            'statusCode': 200,
            'body': transform_price_lists(price_lists_db)
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }
    

    