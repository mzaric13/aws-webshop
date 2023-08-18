import json
import boto3
import psycopg2
from psycopg2 import sql
from datetime import datetime

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class Item:
    def __init__(self, item_id, item_name, price, item_pictures) -> None:
        self.item_id = item_id
        self.item_name = item_name
        self.price = price
        self.item_pictures = item_pictures

    def to_json(self):
        data = {
            "id": self.item_id,
            "name": self.item_name,
            "price": self.price,
        }
        return data

class OrderItem:
    def __init__(self, quantity, item, item_size) -> None:
        self.quantity = quantity
        self.item = item
        self.item_size = item_size

    def to_json(self):
        data = {
            "quantity": self.quantity,
            "item": self.item.to_json(),
            "itemSize": self.item_size
        }
        return data

class Order:
    def __init__(self, id, price, date, order_items, status, email) -> None:
        self.id = id
        self.price = price
        self.date = date
        self.order_items = order_items
        self.status = status
        self.email = email

    def to_json(self):
        order_items = list(map(lambda x: x.to_json(), self.order_items))
        data = {
            "id": self.id,
            "price": self.price,
            "date": self.date.isoformat(),
            "orderItems": order_items,
            "status": self.status,
            "userEmail": self.email
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

def get_orders_for_user(conn, page, page_size):
    try:
        query = sql.SQL("SELECT ord.id, ord.date, ord.price, json_agg(json_build_object('item_id', oi.item_id, 'quantity', oi.quantity, 'price', oi.price, 'name', it.name, 'status', ords.name, 'email', usr.email, 'item_size', oi.item_size)) FROM orders ord INNER JOIN orders_order_items ooi ON ord.id = ooi.order_id INNER JOIN order_items oi ON ooi.order_item_id = oi.id INNER JOIN items it ON oi.item_id = it.id INNER JOIN order_statuses ords ON ord.status_id = ords.id INNER JOIN users usr ON ord.user_id = usr.id GROUP BY ord.id, ord.date, ord.price ORDER BY ord.id ASC LIMIT %s OFFSET %s")
        cursor = conn.cursor()
        offset = (page - 1) * page_size
        cursor.execute(query, (page_size, offset,))
        orders = cursor.fetchall()
        cursor.close()
        return orders
    except Exception as e:
        return False
    
def get_number_of_orders(conn):
    try:
        query = sql.SQL("SELECT COUNT(id) FROM orders")
        cursor = conn.cursor()
        cursor.execute(query)
        number = cursor.fetchall()
        cursor.close()
        return number
    except Exception as e:
        return False
    
def transform_orders(orders_db):
    orders = []
    for order_db in orders_db:
        order_items = []
        for order_item_db in order_db[3]:
            order_items.append(OrderItem(int(order_item_db['quantity']), Item(int(order_item_db['item_id']), order_item_db['name'], float(order_item_db['price']), []), order_item_db['item_size']))
        order = Order(order_db[0], order_db[2], order_db[1], order_items, order_item_db['status'], order_item_db['email'])
        orders.append(order.to_json())
    return orders
    

def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        orders_db = get_orders_for_user(connection, int(event['page']), int(event['pageSize']))
        orders_num = get_number_of_orders(connection)
        connection.close()
        if orders_db == False:
            return {
                'statusCode': 500,
                'body': json.dumps('Error reading orders from database')
            }
        return {
            'statusCode': 200,
            'body': {"orders": transform_orders(orders_db), "numberOfOrders": orders_num[0][0]}
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }