import axios from "axios";
import {
  CreateOrderReturnValue,
  ExecuteOrderReturnValue,
  Order,
} from "../models/Order";
import { baseUrl } from "../utils/Util";

export const createOrderBE = (order: Order) => {
  return axios.post<CreateOrderReturnValue>(`${baseUrl}/orders/create`, order);
};

export const getPayPalToken = () => {
  return axios.get<string>(`${baseUrl}/paypal/token`);
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
