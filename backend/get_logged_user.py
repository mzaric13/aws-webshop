import cognitojwt
import boto3
from datetime import datetime
import psycopg2
from psycopg2 import sql

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class User:
    def __init__(self, id, email, given_name, family_name, address, phone_number, birthdate) -> None:
        self.id = id
        self.email = email
        self.given_name = given_name
        self.family_name = family_name
        self.address = address
        self.phone_number = phone_number
        self.birthdate = birthdate

    def to_json(self):
        data = {
            "id": self.id,
            "email": self.email,
            "givenName": self.given_name,
            "familyName": self.family_name,
            "address": self.address,
            "phoneNumber": self.phone_number,
            "birthdate": self.birthdate.isoformat()
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

def get_email(token):
    try:
        verified_claims: dict = cognitojwt.decode(
            token,
            "eu-north-1",
            "eu-north-1_UACEsjHap",
            app_client_id="2qe9t74d5bam4t3qmaee5s9ggh",
            testmode=True
        )
        return verified_claims["email"]
    except Exception as e:
        return False
    
def get_user_by_email(conn, email):
    try:
        query = sql.SQL("SELECT * FROM users WHERE email = %s")
        cursor = conn.cursor()
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        cursor.close()
        return User(user[0], email, user[5], user[4], user[1], user[6], user[2])
    except Exception as e:
        return False

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        email = get_email(event["authorizationToken"])
        if email == False:
            return {
                'statusCode': 500,
                'body': 'Error exctracting data from token'
            }
        connection = get_connection(secret_string_db)
        user = get_user_by_email(connection, email)
        connection.close()
        if user == False:
            return {
                'statusCode': 500,
                'body': 'Error collecting user data from database'
            }
        return {
            'statusCode': 200,
            'body': user.to_json()
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials'
        }