import json
import boto3
import psycopg2

secrets_manager_client = boto3.client('secretsmanager', region_name='eu-north-1')

class ItemType:
   def __init__(self, id, name):
        self.id = id
        self.name = name

class Brand:
   def __init__(self, id, name):
        self.id = id
        self.name = name

class Tag:
   def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

class ReturnItem:
    def __init__(self, id: int, name: str, description: str, pictures, price, item_type_id, brand_id):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.item_type_id = item_type_id
        self.brand_id = brand_id
        # TODO
        self.pictures = pictures

    def to_json(self):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'brandId': self.brand_id,
            'itemTypeId': self.item_type_id
        }
        return data

class SearchData:
    def __init__(self, page: int, page_size: int, item_type=None, brands=None, tags=None, sort=None) -> None:
        self.page = page
        self.page_size = page_size
        self.item_type = item_type
        self.brands = brands
        self.tags = tags
        self.sort = sort

def convert_to_search_data(event):
    item_type = None
    brands = []
    tags = []
    sort_opt = None
    if 'itemType' in event.keys():
        item_type = ItemType(int(event['itemType']['id']), event['itemType']['name'])
    if 'brands' in event.keys():
        for b in event['brands']:
            brands.append(Brand(int(b['id']), b['name']))
    if 'tags' in event.keys():
        for t in event['tags']:
            tags.append(Tag(int(t['id']), t['name'], t['description']))
    if 'sortOption' in event.keys():
        sort_opt = event['sortOption']
    return SearchData(int(event['page']), int(event['pageSize']), item_type, brands, tags, sort_opt)

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

def create_query(query, search_data: SearchData):
    if search_data.item_type is not None:
        query += " AND it.item_type_id = " + str(search_data.item_type.id)
    query += create_brands_part(search_data.brands)
    query += create_tags_part(search_data.tags)
    return query
    
def create_brands_part(brands):
    if brands is not None and len(brands) != 0:
        result_string = ', '.join(str(brand.id) for brand in brands)
        return " AND bd.id IN (" +  result_string + ")"
    else:
        return ""
    
def create_tags_part(tags):
    if tags is not None and len(tags) != 0:
        result_string = ', '.join(str(tag.id) for tag in tags)
        return " AND tg.id IN (" +  result_string + ")"
    else:
        return ""
    
def create_sort_part(sort_option):
    if sort_option == 'A-Z':
        return " ORDER BY it.name ASC"
    elif sort_option == 'Z-A':
        return " ORDER BY it.name DESC"
    elif sort_option == 'Price: Low to High':
        return " ORDER BY pli.price ASC"
    elif sort_option == 'Price: High to Low':
        return " ORDER BY pli.price DESC"
    else:
        return ""
    
def create_pagination_part(page, page_size):
    offset = (page - 1) * page_size
    return " LIMIT " + str(page_size) + " OFFSET " + str(offset) + ";"

def collect_items(conn, search_data: SearchData):
    try:
        query = "SELECT DISTINCT it.id, it.name, it.description, pli.price, it.item_type_id, it.brand_id FROM items it INNER JOIN item_tags it_tg ON it.id = it_tg.item_id INNER JOIN tags tg ON it_tg.tag_id = tg.id INNER JOIN brands bd ON it.brand_id = bd.id INNER JOIN price_list_items pli ON pli.item_id = it.id INNER JOIN price_lists_item plsi ON pli.id = plsi.price_list_item_id INNER JOIN price_lists pl ON pl.id = plsi.price_list_id WHERE pl.valid = true"
        query = create_query(query, search_data)
        query += create_sort_part(search_data.sort)
        query += create_pagination_part(search_data.page, search_data.page_size)
        cursor = conn.cursor()
        cursor.execute(query)
        items = cursor.fetchall()
        cursor.close()
        return items
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False
        
def get_number_of_items(conn, search_data: SearchData):
    try:
        query = "SELECT COUNT(DISTINCT (it.id, it.name, it.description, pli.price)) FROM items it INNER JOIN item_tags it_tg ON it.id = it_tg.item_id INNER JOIN tags tg ON it_tg.tag_id = tg.id INNER JOIN brands bd ON it.brand_id = bd.id INNER JOIN price_list_items pli ON pli.item_id = it.id INNER JOIN price_lists_item plsi ON pli.id = plsi.price_list_item_id INNER JOIN price_lists pl ON pl.id = plsi.price_list_id WHERE pl.valid = true"
        query = create_query(query, search_data)
        cursor = conn.cursor()
        cursor.execute(query)
        number = cursor.fetchall()
        cursor.close()
        return number
    except Exception as e:
        print(f"Error reading from database: {str(e)}")
        return False
    
def transform_items(data):
    items = []
    for item in data:
        i = ReturnItem(int(item[0]), item[1], item[2], [], float(item[3]), int(item[4]), int(item[5]))
        items.append(i.to_json())
    return items
    
def lambda_handler(event, context):
    secret_string_db = get_secrets_manager_credentials("dev/WebShop/PostgreSQL")
    if secret_string_db:
        connection = get_connection(secret_string_db)
        search_data = convert_to_search_data(event)
        items = collect_items(connection, search_data)
        items_num = get_number_of_items(connection, search_data)
        connection.close()
        if items == False:
            return {
                'statusCode': 500,
                'body': json.dumps('Error reading brands from database')
            }
        return {
            'statusCode': 200,
            'body': {"items": transform_items(items), "numberOfItems": items_num[0][0]}
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting database credentials')
        }