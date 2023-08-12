import axios from "axios";
import { PriceListReturnValue } from "../models/PriceList";
import { baseUrl } from "../utils/Util";

export const getPriceLists = () => {
  return axios.get<{ statusCode: number; body: PriceListReturnValue }>(
    `${baseUrl}/price-list`
  );
};
