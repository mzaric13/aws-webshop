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

class UpdatePriceList:
    def __init__(self, id, price_list_items, valid_to) -> None:
        self.id = id
        self.price_list_items = price_list_items
        self.valid_to = valid_to

def transform_event(event):
    price_list_items = []
    valid_to = ''
    if 'validTo' in event.keys():
        valid_to = event['validTo']
    for pli in event['priceListItems']:
        price_list_items.append(PriceListItem(pli['priceListItemId'], pli['itemId'], pli['itemName'], pli['price']))
    return UpdatePriceList(event['priceListId'], price_list_items, valid_to)

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

def update_price_list_items(conn, price_list_items):
    values = []
    for price_list_item in price_list_items:
        values.append((price_list_item.price, price_list_item.id))
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE price_list_items SET price = %s WHERE id = %s")
        cursor.executemany(update_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def update_price_list_date(conn, update_price_list: UpdatePriceList):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE price_lists SET valid_to = %s WHERE id = %s")
        cursor.execute(update_query, (update_price_list.valid_to, update_price_list.id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        update_price_list = transform_event(event)
        connection = get_connection(secret_string_db)
        if update_price_list_items(connection, update_price_list.price_list_items):  
          if update_price_list.valid_to != '':
              if update_price_list_date(connection, update_price_list):
                  connection.close()
                  return {
                      'statusCode': 200,
                      'body': 'Successfully updated price list'
                  }
              connection.close()
              return {
                  'statusCode': 500,
                  'body': 'Error updating valid to date for price list'
              }
          connection.close()
          return {
              'statusCode': 200,
              'body': 'Successfully updated price list'
          }
        connection.close()
        return {
            'statusCode': 500,
            'body': 'Error updating prices'
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }