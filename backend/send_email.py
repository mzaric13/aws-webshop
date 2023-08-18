import boto3

def lambda_handler(event, context):
    sender = "matijazaric9@gmail.com"
    recipient = "nekistudent123@gmail.com"
    subject = "Order status changed"
    body = """
    Your orders status have been changed. 
    
    For order with id:  {}.

    Current status is:  {}.

    Regards,
    AwsWebShop.
    """.format(event["orderId"], event['currentStatus'])
    ses = boto3.client("ses")
    try:
        response = ses.send_email(
            Source=sender,
            Destination={"ToAddresses": [recipient]},
            Message={
                "Subject": {"Data": subject},
                "Body": {
                    'Text':{
                      'Data': body,
                      'Charset': 'UTF-8'
                    }
                }
            }
        )
        return True
    except Exception as e:
        return False