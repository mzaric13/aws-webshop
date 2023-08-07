import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class ItemAvailability:
    def __init__(self, number_of_items_left, item_size=None):
        self.number_of_items_left = number_of_items_left
        self.item_size = item_size

    def to_json(self):
        data = {
            'numberOfItemsLeft': self.number_of_items_left,
            'itemSize': self.item_size if self.item_size is not None else 'All',
        }
        return data


class ItemAdditionalData:
    def __init__(self, item_id, item_availabilities, sizes, tags) -> None:
        self.item_id = item_id
        self.item_availabilities = item_availabilities
        self.sizes = sizes
        self.tag_ids = tags

    def to_json(self):
        list_availabilities = list(map(lambda x: x.to_json(), self.item_availabilities))
        data = {
            'itemId': self.item_id,
            'sizes': self.sizes,
            'itemAvailabilities': list_availabilities,
            'tagIds': self.tag_ids,
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

def get_tags(conn, id_list):
    try:
        result_string = ', '.join(str(id) for id in id_list)
        query = "SELECT item_id, json_agg(tag_id) FROM item_tags WHERE item_id IN (" + result_string + ") GROUP BY item_id;"
        cursor = conn.cursor()
        cursor.execute(query)
        items = cursor.fetchall()
        cursor.close()
        return items
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False
    
def get_item_availabilities(conn, id_list):
    try:
        result_string = ', '.join(str(id) for id in id_list)
        query = "SELECT item_id, json_agg(json_build_object('item_size', item_size, 'number_of_items_left', number_of_items_left)) FROM item_availability WHERE item_id IN (" + result_string + ") GROUP BY item_id;"
        cursor = conn.cursor()
        cursor.execute(query)
        items = cursor.fetchall()
        cursor.close()
        return items
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False

def transform_tags(tags, item_availabilities, id_list):
    return_val = []
    for id in id_list:
        tag_ids = []
        it_av = []
        sizes = []
        for tag in tags:
            if tag[0] == id:
                tag_ids = tag[1]
                break
        for item_availability in item_availabilities:
            if item_availability[0] == id:
                for data in item_availability[1]:
                  it_av.append(ItemAvailability(int(data['number_of_items_left']), data['item_size']))
                  if data['item_size'] is not None:
                      sizes.append(data['item_size'])
                break
        ia = ItemAdditionalData(id, it_av, sizes, tag_ids)
        return_val.append(ia.to_json())
    return return_val

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        tags = get_tags(connection, event["idList"])
        if tags == False:
            connection.close()
            return {
                'statusCode': 500,
                'body': 'Error reading tags from database'
            }
        else:
            item_availabilities = get_item_availabilities(connection, event['idList'])
            connection.close()
            if tags == False:
                return {
                    'statusCode': 500,
                    'body': 'Error reading tags from database'
                }
            return {
                'statusCode': 200,
                'body': transform_tags(tags, item_availabilities, event['idList'])
            }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }