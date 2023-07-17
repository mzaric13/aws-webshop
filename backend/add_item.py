import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class Item:
  def __init__(self, name, description, pictures) -> None:
    self.name = name
    self.description = description
    # TODO
    self.pictures = pictures

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
        insert_query = "INSERT INTO items (name, description) VALUES (%s, %s);"
        cursor.execute(insert_query, (item.name, item.description,))
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
        if not write_item_to_database(connection, Item(event['name'], event['description'], [])):
          connection.close()
          return {
              'statusCode': 500,
              'body': json.dumps("Error adding item")
          }
        else:
          connection.close()
          return {
              'statusCode': 200,
              'body': json.dumps("Item successfullt added")
          }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }