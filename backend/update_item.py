import json
import boto3
import psycopg2
from psycopg2 import sql

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class ItemAvailability:
    def __init__(self, number_of_items_left, item_size=None):
        self.number_of_items_left = number_of_items_left
        self.item_size = item_size

class UpdateItem:
    def __init__(self, id, item_type_id, name, description, brand_id, item_availabilities, sizes, tag_ids):
        self.id = id
        self.item_type_id = item_type_id
        self.name = name
        self.description = description
        self.brand_id = brand_id
        self.item_availabilities = item_availabilities
        self.sizes = sizes
        self.tag_ids = tag_ids

def convert_to_update_item(event):
    if int(event['itemTypeId']) == 3:
        ia = ItemAvailability(int(event['itemAvailabilities'][0]['numberOfItemsLeft']))
    else:
        ia = []
        for item_availability in event['itemAvailabilities']:
            ia.append(ItemAvailability(int(item_availability['numberOfItemsLeft']), item_availability['itemSize']))
    return UpdateItem(int(event['id']), int(event['itemTypeId']), event['name'], event['description'], int(event['brandId']), ia, event['sizes'], event['tagIds'])

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

def update_tags(conn, update_item: UpdateItem):
    try:
        cursor = conn.cursor()
        delete_query = sql.SQL("DELETE FROM item_tags WHERE item_id = %s")
        cursor.execute(delete_query, (update_item.id,))
        insert_query = sql.SQL("INSERT INTO item_tags (item_id, tag_id) VALUES (%s, %s)")
        values = []
        for tag_id in update_item.tag_ids:
            values.append((update_item.id, tag_id))
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def update_sizes(conn, update_item: UpdateItem):
    try:
        cursor = conn.cursor()
        delete_query = sql.SQL("DELETE FROM sizes WHERE id = %s")
        cursor.execute(delete_query, (update_item.id,))
        insert_query = sql.SQL("INSERT INTO sizes (id, size) VALUES (%s, %s)")
        values = []
        for size in update_item.sizes:
            values.append((update_item.id, size))
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def update_item_availabilities(conn, update_item: UpdateItem):
    try:
        cursor = conn.cursor()
        delete_query = sql.SQL("DELETE FROM item_availability WHERE item_id = %s")
        cursor.execute(delete_query, (update_item.id,))
        if update_item.item_type_id == 3:
            insert_query = sql.SQL("INSERT INTO item_availability (item_id, number_of_items_left) VALUES (%s, %s)")
            cursor.execute(insert_query, (update_item.id, update_item.item_availabilities.number_of_items_left,))
        else:
            values = []
            for item_availability in update_item.item_availabilities:
                values.append((update_item.id, item_availability.item_size, item_availability.number_of_items_left))
            insert_query = sql.SQL("INSERT INTO item_availability (item_id, item_size, number_of_items_left) VALUES (%s, %s, %s)")
            cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def update_item(conn, update_item_data: UpdateItem):
    try:
        cursor = conn.cursor()
        update_query = sql.SQL("UPDATE items SET name = %s, description = %s, brand_id = %s WHERE id = %s")
        cursor.execute(update_query, (update_item_data.name, update_item_data.description, update_item_data.brand_id, update_item_data.id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        update_item_data = convert_to_update_item(event)
        result = update_tags(connection, update_item_data)
        if result == False:
            connection.close()
            return {
                'statusCode': 500,
                'body': 'Error writing into database'
            }
        else:
            if not update_sizes(connection, update_item_data):
                connection.close()
                return {
                    'statusCode': 500,
                    'body': 'Error writing into database'
                }
            else:
                if not update_item_availabilities(connection, update_item_data):
                    connection.close()
                    return {
                        'statusCode': 500,
                        'body': 'Error writing into database'
                    }
                else:
                    if not update_item(connection, update_item_data):
                        connection.close()
                        return {
                            'statusCode': 500,
                            'body': 'Error writing into database'
                        }
                    connection.close()
                    return {
                        'statusCode': 200,
                        'body': "Successfully updated item"
                    }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }
