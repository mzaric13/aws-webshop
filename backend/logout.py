import boto3

client = boto3.client('cognito-idp', region_name='eu-north-1')
    
def logout(access_token):
    try:
        response = client.global_sign_out(
            AccessToken=access_token
        )
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    token = event['headers']['Authorization']
    if logout(token):
        return {
            'statuscCode': 200,
            'body': 'Logout successfull'
        }
    else:
        return {
            'statuscCode': 500,
            'body': 'Logout failed'
        }