import cognitojwt

def validate_token(token):
    try:
        verified_claims: dict = cognitojwt.decode(
            token,
            "eu-north-1",
            "eu-north-1_UACEsjHap",
            app_client_id="2qe9t74d5bam4t3qmaee5s9ggh"
        )
        return verified_claims
    except Exception as e:
        return False
    
def generate_policy(principal_id, effect, resource):
    policy = {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource
                }
            ]
        }
    }
    return policy


def lambda_handler(event, context):
    token = event['authorizationToken']
    decoded_token = validate_token(token)
    if decoded_token == False:
        return generate_policy("unauthorized", "Deny", event["methodArn"])
    else:
        if decoded_token['custom:role'] == "ADMIN":
            return generate_policy(decoded_token["sub"], "Allow", event["methodArn"])
        else:
            return generate_policy("unauthorized", "Deny", event["methodArn"])