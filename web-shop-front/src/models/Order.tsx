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

export interface OrderReturnValue {
  id: number;
  status: string;
  userEmail: string;
  date: Date;
  price: number;
  orderItems: OrderItemReturnValue[];
}

export interface OrderItemReturnValue {
  quantity: number;
  item: ItemOrderItemReturnValue;
  itemSize: string;
}

export interface ItemOrderItemReturnValue {
  id: number;
  name: string;
  price: number;
  pictures?: string[];
}

export interface GetOrdersReturnValue {
  numberOfOrders: number;
  orders: OrderReturnValue[];
}

export interface OrderStatus {
  id: number;
  name: string;
}
