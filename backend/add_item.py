import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class ItemType:
   def __init__(self, id, name):
        self.id = id
        self.name = name

class Brand:
   def __init__(self, id, name):
        self.id = id
        self.name = name

class Tag:
   def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

class Item:
  def __init__(self, name: str, description: str, pictures, item_type: ItemType, brand: Brand, sizes, tags):
    self.name = name
    self.description = description
    self.item_type = item_type
    self.brand = brand
    self.sizes = sizes
    self.tags = tags
    # TODO
    self.pictures = pictures

def convert_to_item(event):
    tags = []
    for t in event['tags']:
        tags.append(Tag(int(t['id']), t['name'], t['description']))
    brand = Brand(int(event['brand']['id']), event['brand']['name'])
    item_type = ItemType(int(event['type']['id']), event['type']['name'])
    return Item(event['name'], event['description'], [], item_type, brand, event['sizes'], tags)

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

def write_item_to_database(conn, item: Item):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO items (name, description, item_type_id, brand_id) VALUES (%s, %s, %s, %s);"
        cursor.execute(insert_query, (item.name, item.description, item.item_type.id, item.brand.id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
        
def get_written_item(conn, item: Item):
    try:
        cursor = conn.cursor()
        select_query = "SELECT id FROM items WHERE name = %s;"
        cursor.execute(select_query, (item.name,))
        rows = cursor.fetchall()
        conn.commit()
        cursor.close()
        return rows[0][0]
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def write_item_sizes_to_database(conn, item_id, item: Item):
    try:
        cursor = conn.cursor()
        values = []
        for size in item.sizes:
            values.append((item_id, size))
        insert_query = "INSERT INTO sizes (id, size) VALUES (%s, %s);"
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False

def write_item_tags_to_database(conn, item_id, item: Item):
    try:
        cursor = conn.cursor()
        values = []
        for tag in item.tags:
            values.append((item_id, tag.id))
        insert_query = "INSERT INTO item_tags (item_id, tag_id) VALUES (%s, %s);"
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        item = convert_to_item(event)
        if not write_item_to_database(connection, item):
            connection.close()
            return {
                'statusCode': 500,
                'body': json.dumps("Error adding item")
            }
        else:
            item_id = get_written_item(connection, item)
            ret_val = {
                'statusCode': 200,
                'body': json.dumps("Item successfullt added")
            }
            if not write_item_sizes_to_database(connection, item_id, item):
                ret_val = {
                    'statusCode': 500,
                    'body': json.dumps("Error adding item")
                }
            if not write_item_tags_to_database(connection, item_id, item):
                ret_val = {
                    'statusCode': 500,
                    'body': json.dumps("Error adding item")
                }
            connection.close()
            return ret_val
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }