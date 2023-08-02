import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class PriceList:
    def __init__(self, id, valid, valid_from, valid_to):
        self.id = id
        self.valid = valid
        self.valid_from = valid_from
        self.valid_to = valid_to

    def to_json(self):
        data = {
            'id': self.id,
            'valid': self.valid,
            'validFrom': self.valid_from.isoformat(),
            'validTo': self.valid_to.isoformat(),
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

def read_current_price_list(conn):
    try:
        query = "SELECT * FROM price_lists WHERE valid = true;"
        cursor = conn.cursor()
        cursor.execute(query)
        price_lists = cursor.fetchall()
        cursor.close()
        return PriceList(price_lists[0][0], price_lists[0][1], price_lists[0][2], price_lists[0][3])
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        price_list = read_current_price_list(connection)
        connection.close()
        if price_list == False:
            return {
                'statusCode': 500,
                'body': 'Error reading brands from database'
            }
        return {
            'statusCode': 200,
            'body': price_list.to_json()
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting database credentials'
        }
