export interface OrderItem {
  itemId: number;
  quantity: number;
  price: number;
  itemSize: string;
}

export interface Order {
  userId: number;
  orderItems: OrderItem[];
  price: number;
}

export interface CreateOrderReturnValue {
  statusCode: number;
  body: { orderId: string; token: string };
}

export interface ExecuteOrderReturnValue {
  statusCode: number;
  body: string;
}
