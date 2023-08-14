import axios from "axios";
import {
  PriceListCreation,
  PriceListReturnValue,
  PriceListUpdate,
} from "../models/PriceList";
import { baseUrl } from "../utils/Util";

export const getPriceLists = () => {
  return axios.get<{ statusCode: number; body: PriceListReturnValue }>(
    `${baseUrl}/price-list`
  );
};

export const addPriceList = (priceListCreation: PriceListCreation) => {
  return axios.post<{ statusCode: number; body: string }>(
    `${baseUrl}/price-list`,
    priceListCreation
  );
};

export const updatePriceList = (updatePriceList: PriceListUpdate) => {
  return axios.put<{ statusCode: number; body: string }>(
    `${baseUrl}/price-list`,
    updatePriceList
  );
};
