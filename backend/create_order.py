import json
import boto3
import psycopg2
from psycopg2 import sql
import paypalrestsdk
from datetime import datetime

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')
lambda_client = boto3.client('lambda', region_name='eu-north-1')

class OrderItem:
    def __init__(self, item_id, quantity, price, item_size) -> None:
        self.item_id = item_id
        self.quantity = quantity
        self.price = price
        self.item_size = item_size

class Order:
    def __init__(self, user_id, order_items, price) -> None:
        self.user_id = user_id
        self.order_items = order_items
        self.price = price

def convert_to_order(event):
    order_items = []
    for oi in event['orderItems']:
        order_items.append(OrderItem(int(oi['itemId']), int(oi['quantity']), float(oi['price']), oi['itemSize']))
    return Order(int(event['userId']), order_items, float(event['price']))

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

def create_pay_pal_order(client_id, client_secret, order_id, order: Order):
    paypalrestsdk.configure({
        "mode": "sandbox",  
        "client_id": client_id,
        "client_secret": client_secret
    })

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [{
            "amount": {
                "total": "{:.2f}".format(order.price),
                "currency": "USD"
            },
            "description": str(order_id)
        }],
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment-success/" + str(order_id),
            "cancel_url": "http://localhost:3000/payment-cancel/" + str(order_id)
        },
    })

    if payment.create():
        #for link in payment.links:
        #    if link.method == "REDIRECT":
        #        redirect_url = link.href
        #        return redirect_url
        token = ''

        links = payment.links
        for i in links:
            if(i.rel=="approval_url"):
                token = i.href.split("EC-",1)[1]
        return token
        #return payment.id
    else:
        return False
    
def write_order_into_database(conn, order: Order):
    try:
        cursor = conn.cursor()
        insert_query = sql.SQL("INSERT INTO orders (status_id, user_id, price, date) VALUES (%s, %s, %s, %s) RETURNING id;")
        cursor.execute(insert_query, (1, order.user_id, order.price, datetime.now().date(),))
        id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return id
    except Exception as e:
        return False
    
def write_order_items_in_database(conn, order_items):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO order_items (item_id, quantity, price, item_size) VALUES (%s, %s, %s, %s) RETURNING id"
        ids = []
        for order_item in order_items:
            cursor.execute(insert_query, (order_item.item_id, order_item.quantity, order_item.price, order_item.item_size,))
            id = cursor.fetchone()[0]
            ids.append(id)   
        conn.commit()
        cursor.close()
        return ids
    except Exception as e:
        return False
    
def write_orders_order_items(conn, order_id, order_item_ids):
    values = []
    for order_item_id in order_item_ids:
        values.append((order_id, order_item_id))
    try:
        cursor = conn.cursor()
        insert_query = sql.SQL("INSERT INTO orders_order_items (order_id, order_item_id) VALUES (%s, %s);")
        cursor.executemany(insert_query, values)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def get_item_additional_data(order_items):
    try:
        response = lambda_client.invoke(
            FunctionName='arn:aws:lambda:eu-north-1:232513253020:function:ReadAditionalItemData',
            InvocationType='RequestResponse',
            Payload=json.dumps({'idList': [item.item_id for item in order_items]})
        )
        json_data = json.loads(response['Payload'].read())
        return json_data.get('body')
    except Exception as e:
        return False
    
def get_values_to_change_availabilities(order_items, item_additional_datas):
    values_no_size = []
    values_size = []
    for order_item in order_items:
        item_availabilities = next(iad['itemAvailabilities'] for iad in item_additional_datas if iad['itemId'] == order_item.item_id)
        #item_availabilities = item_additional_datas[0]['itemAvailabilities']
        if order_item.item_size == "":
            values_no_size.append((int(item_availabilities[0]['numberOfItemsLeft']) - order_item.quantity, order_item.item_id))
        else:
            preNumberOfItems = next(ia['numberOfItemsLeft'] for ia in item_availabilities if ia['itemSize'] == order_item.item_size)
            values_size.append((int(preNumberOfItems) - order_item.quantity, order_item.item_id, order_item.item_size))
    return values_size, values_no_size
            


def update_item_availabilities(conn, values_size, values_no_size):
    try:
        cursor = conn.cursor()
        if len(values_no_size) > 0:
            update_query = sql.SQL("UPDATE item_availability SET number_of_items_left = %s WHERE item_id = %s")
            cursor.executemany(update_query, values_no_size)
        if len(values_size) > 0:
            update_query = sql.SQL("UPDATE item_availability SET number_of_items_left = %s WHERE item_id = %s AND item_size = %s")
            cursor.executemany(update_query, values_size)
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        return False
    
def lambda_handler(event, context):
    secret_string_paypal = eval(get_secrets_manager_credentials("dev/WebShop/PayPalNewCred"))
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_paypal and secret_string_db:
        order = convert_to_order(event)
        conn = get_connection(secret_string_db)
        items_additional_data = get_item_additional_data(order.order_items)
        if items_additional_data == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error getting item additional data.'
            }
        order_id = write_order_into_database(conn, order)
        if order_id == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing order into database.'
            }
        order_item_ids = write_order_items_in_database(conn, order.order_items)
        if order_item_ids == False:
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing order items in database.'
            }
        if not write_orders_order_items(conn, order_id, order_item_ids):
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error writing orders order items in database.'
            }
        values_size, values_no_size = get_values_to_change_availabilities(order.order_items, items_additional_data)
        if not update_item_availabilities(conn, values_size, values_no_size):
            conn.close()
            return {
                'statusCode': 500,
                'body': 'Error updating item availabilities.'
            }
        conn.close()
        redirect_url = create_pay_pal_order(secret_string_paypal['PayPalCLiendID'], secret_string_paypal['PayPalClientSecret'], order_id, order)
        if redirect_url == False:
            return {
                'statusCode': 500,
                'body': 'Error creating PayPal payment'
            }
        return {
            'statusCode': 200,
            'body': {'orderId': order_id, 'token': redirect_url}
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error getting credentials'
        }