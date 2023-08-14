from datetime import datetime

import boto3
import psycopg2
from psycopg2 import sql

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class PriceListItem:
    def __init__(self, id, item_id, item_name, price ) -> None:
        self.id = id
        self.item_id = item_id
        self.item_name = item_name
        self.price = price

class PriceListCreation:
    def __init__(self, price_list_items, valid_to) -> None:
        self.price_list_items = price_list_items
        self.valid_to = valid_to

def transform_event(event):
    price_list_items = []
    valid_to = ''
    for pli in event['priceListItems']:
        price_list_items.append(PriceListItem(pli['priceListItemId'], pli['itemId'], pli['itemName'], pli['price']))
    return PriceListCreation(price_list_items, event['validTo'])

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

def set_current_price_list_to_be_invalid(conn):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE price_lists SET valid = false WHERE valid = true")
        cursor.execute(update_query)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False

def write_price_list(conn, price_list: PriceListCreation):
    try:
        cursor = conn.cursor()
        insert_query = sql.SQL("INSERT INTO price_lists (valid, valid_from, valid_to) VALUES (%s, %s, %s) RETURNING id;")
        cursor.execute(insert_query, (True, datetime.now().date(), price_list.valid_to,))
        id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        return False
    
def write_price_list_items(conn, price_list_items):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO price_list_items (item_id, price) VALUES (%s, %s) RETURNING id"
        ids = []
        for price_list_item in price_list_items:
            cursor.execute(insert_query, (price_list_item.item_id, price_list_item.price,))
            id = cursor.fetchone()[0]
            ids.append(id)   
        conn.commit()
        cursor.close()
        return ids
    except Exception as e:
        return False
    
def write_price_lists_items(conn, price_list_id, price_list_items_ids):
    values = []
    for price_list_item_id in price_list_items_ids:
        values.append((price_list_id, price_list_item_id))
    try:
        cursor = conn.cursor()
        insert_query = sql.SQL("INSERT INTO price_lists_item (price_list_id, price_list_item_id) VALUES (%s, %s);")
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_paypal = eval(get_secrets_manager_credentials("dev/WebShop/PayPalNewCred"))
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_paypal and secret_string_db:
        price_list_creation = transform_event(event)
        conn = get_connection(secret_string_db)
        if set_current_price_list_to_be_invalid(conn) == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error invalidating current price list.'
            }
        price_list_id = write_price_list(conn, price_list_creation)
        if price_list_id == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing price list into database.'
            }
        price_list_item_ids = write_price_list_items(conn, price_list_creation.price_list_items)
        if price_list_item_ids == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing price list items in database.'
            }
        if not write_price_lists_items(conn, price_list_id, price_list_item_ids):
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing price list items for current price list in database.'
            }
        conn.close()
        return {
            'statusCode': 200,
            'body': 'Successfully added new price list'
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials'
        }