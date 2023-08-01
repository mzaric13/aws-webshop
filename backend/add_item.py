import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')
lambda_client = boto3.client('lambda', region_name='eu-north-1')

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
        
class ItemAvailability:
    def __init__(self, number_of_items_left, item_size=None):
        self.number_of_items_left = number_of_items_left
        self.item_size = item_size

class Item:
  def __init__(self, name: str, description: str, pictures, item_type: ItemType, brand: Brand, sizes, tags, price, item_availabilities):
    self.name = name
    self.description = description
    self.item_type = item_type
    self.brand = brand
    self.sizes = sizes
    self.tags = tags
    self.price = price
    self.item_availabilities = item_availabilities
    # TODO
    self.pictures = pictures

def convert_to_item(event):
    tags = []
    for t in event['tags']:
        if int(t['id']) != -1:
            tags.append(Tag(int(t['id']), t['name'], t['description']))
    brand = Brand(int(event['brand']['id']), event['brand']['name'])
    item_type = ItemType(int(event['itemType']['id']), event['itemType']['name'])
    if item_type.name == 'EQUIPMENT':
        item_availabilities = ItemAvailability(int(event['itemAvailabilities'][0]['numberOfItemsLeft']))
    else:
        item_availabilities = []
        for item_availability in event['itemAvailabilities']:
            ia = ItemAvailability(int(item_availability['numberOfItemsLeft']), item_availability['itemSize'])
            item_availabilities.append(ia)
    return Item(event['name'], event['description'], [], item_type, brand, event['sizes'], tags, float(event['price']), item_availabilities)

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
    
def get_current_price_list_id():
    try:
        response = lambda_client.invoke(
            FunctionName='arn:aws:lambda:eu-north-1:232513253020:function:ReadCurrentPriceList',
            InvocationType='RequestResponse',
        )
        json_data = json.loads(response['Payload'].read())
        return int(json_data.get('body')['id'])
    except Exception as e:
        return False

def write_item_to_database(conn, item: Item):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO items (name, description, item_type_id, brand_id) VALUES (%s, %s, %s, %s) RETURNING id;"
        cursor.execute(insert_query, (item.name, item.description, item.item_type.id, item.brand.id,))
        id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def write_item_sizes_to_database(conn, item_id, item: Item):
    if item.item_type.name == "EQUIPMENT":
        return True
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
        
def write_item_availabilities(conn, item_id, item: Item):
    try:
        cursor = conn.cursor()
        if item.item_type.name == 'EQUIPMENT':
            insert_query = "INSERT INTO item_availability (item_id, number_of_items_left) VALUES (%s, %s);"
            cursor.execute(insert_query, (item_id, item.item_availabilities.number_of_items_left,))
        else:
            values = []
            for item_availability in item.item_availabilities:
                values.append((item_id, item_availability.item_size, item_availability.number_of_items_left))
            insert_query = "INSERT INTO item_availability (item_id, item_size, number_of_items_left) VALUES (%s, %s, %s)"
            cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
        
def write_item_price(conn, item_id, item: Item):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO price_list_items (item_id, price) VALUES (%s, %s) RETURNING id;"
        cursor.execute(insert_query, (item_id, item.price,))
        id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        return False
        
def write_price_to_current_price_list(conn, price_list_id, price_list_item_id):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO price_lists_item (price_list_id, price_list_item_id) VALUES (%s, %s);"
        cursor.execute(insert_query, (price_list_id, price_list_item_id,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        item = convert_to_item(event)
        id = write_item_to_database(connection, item)
        if id == False:
            connection.close()
            return {
                'statusCode': 500,
                'body': "Error adding item"
            }
        else:
            ret_val = {
                'statusCode': 200,
                'body': "Item successfullt added"
            }
            if not write_item_sizes_to_database(connection, id, item):
                ret_val = {
                    'statusCode': 500,
                    'body': "Error writing sizes to database"
                }
            if not write_item_tags_to_database(connection, id, item):
                ret_val = {
                    'statusCode': 500,
                    'body': "Error writing tags into database"
                }
            if not write_item_availabilities(connection, id, item):
                ret_val = {
                    'statusCode': 500,
                    'body': "Error writing availability into database"
                }
            price_list_id = get_current_price_list_id()
            if price_list_id == False:
                ret_val = {
                    'statusCode': 500,
                    'body': "Error reading current price list"
                }
            else:
                price_list_item_id = write_item_price(connection, id, item)
                if price_list_item_id == False:
                    ret_val = {
                        'statusCode': 500,
                        'body': "Error writing item price"
                    }
                else:
                    if not write_price_to_current_price_list(connection, price_list_id, price_list_item_id):
                        ret_val = {
                            'statusCode': 500,
                            'body': "Error writing item price"
                        }
            connection.close()
            return ret_val
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }