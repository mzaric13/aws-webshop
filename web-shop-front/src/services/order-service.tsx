import axios from "axios";
import {
  CreateOrderReturnValue,
  ExecuteOrderReturnValue,
  GetOrdersReturnValue,
  Order,
  OrderStatus,
} from "../models/Order";
import { baseUrl } from "../utils/Util";

export const createOrderBE = (order: Order) => {
  return axios.post<CreateOrderReturnValue>(`${baseUrl}/orders/create`, order);
};

export const executePayment = (
  orderId: string,
  paymentId: string,
  payerId: string,
  token: string
) => {
  return axios.post<ExecuteOrderReturnValue>(
    `${baseUrl}/orders/execute/${orderId}?paymentId=${paymentId}&PayerID=${payerId}&token=${token}`
  );
};

export const getOrdersAdmin = (page: number, pageSize: number) => {
  return axios.post<{ statusCode: number; body: GetOrdersReturnValue }>(
    `${baseUrl}/orders/get/admin`,
    {
      page: page,
      pageSize: pageSize,
    }
  );
};

export const changeOrderStatus = (orderId: number, statusId: number) => {
  return axios.put<{ statusCode: number; body: string }>(`${baseUrl}/orders`, {
    orderId,
    statusId,
  });
};

export const getOrderStatuses = () => {
  return axios.get<{ statusCode: number; body: OrderStatus[] }>(
    `${baseUrl}/order-status`
  );
};

export const getOrdersUser = (
  userId: number,
  page: number,
  pageSize: number
) => {
  return axios.post<{ statusCode: number; body: GetOrdersReturnValue }>(
    `${baseUrl}/orders/get/user`,
    {
      userId: userId,
      page: page,
      pageSize: pageSize,
    }
  );
};
