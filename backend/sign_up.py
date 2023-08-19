import json
import boto3
import psycopg2
from botocore.exceptions import ClientError

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')
cognito_client = boto3.client('cognito-idp', region_name='eu-north-1')

class User:
    def __init__(self, email, given_name, family_name, address, phone_number, birthdate):
        self.email = email
        self.given_name = given_name
        self.family_name = family_name
        self.address = address
        self.phone_number = phone_number
        self.birthdate = birthdate    

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

def write_user_to_database(conn, user):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO users (email, given_name, family_name, address, phone_number, birthdate) VALUES (%s, %s, %s, %s, %s, %s);"
        cursor.execute(insert_query, (user.email, user.given_name, user.family_name, user.address, user.phone_number, user.birthdate,))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error writing object to database: {str(e)}")
        return False
    
def singup_user(event, client_id):
    try:
        cognito_client.sign_up(
            ClientId=client_id,
            Username=event['username'],
            Password=event['password'],
            UserAttributes=[
                {
                    'Name': 'given_name',
                    'Value': event['givenName']
                },
                {
                    'Name': 'family_name',
                    'Value': event['familyName']
                },
                {
                    'Name': 'email',
                    'Value': event['username']
                },                
                {
                    'Name': 'birthdate',
                    'Value': event['birthdate']
                },
                {
                    'Name': 'phone_number',
                    'Value': event['phoneNumber']
                },
                {
                    'Name': 'address',
                    'Value': event['address']
                },
                {
                    'Name': 'custom:role',
                    'Value': 'USER'
                }
            ]
        )
        return User(event['username'], event['givenName'], event['familyName'], event['address'], event['phoneNumber'], event['birthdate'])
    except ClientError as e:
        return e
    
def lambda_handler(event, context):
    secret_string_cognito = eval(get_secrets_manager_credentials("dev/WenShop/UserPoolCred"))
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_cognito and secret_string_db:
        response = singup_user(event, secret_string_cognito['ClientID'])
        if not isinstance(response, User):
            return {
                'statusCode': 500,
                'body': f"Error writing object to database: {str(response)}"
            }
        conn = get_connection(secret_string_db)
        if write_user_to_database(conn, response):
            conn.close()
            return {
                'statusCode': 200,
                'body': 'You signed up successfully.'
            }
        else:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Server error while signing up.'
            }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials'
        }
            