import boto3

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')
client = boto3.client('cognito-idp', region_name='eu-north-1')

def get_secrets_manager_credentials(secret_name):
    try:
        response = secrets_manager_client.get_secret_value(SecretId=secret_name)
        secret_string = response['SecretString']
        return secret_string
    except Exception as e:
        return None
    
def login(username, password, client_id):
    try:
        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            },
            ClientId=client_id
        )
        access_token = response['AuthenticationResult']['AccessToken']
        id_token = response['AuthenticationResult']['IdToken']
        return { 'accessToken': access_token, 'idToken': id_token }
    except Exception as e:
        return False

def lambda_handler(event, context):
    secret_string_cognito = eval(get_secrets_manager_credentials("dev/WenShop/UserPoolCred"))
    if secret_string_cognito:
        auth_cred = login(event['email'], event['password'], secret_string_cognito['ClientID'])
        if auth_cred == False:
            return {
                'statusCode': 400,
                'body': 'Wrong credentials'
            }
        return {
            'statusCode': 200,
            'body': auth_cred
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials'
        }