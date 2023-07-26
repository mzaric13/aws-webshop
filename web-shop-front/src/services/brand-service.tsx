import axios from "axios";
import { ReturnValueBrand } from "../models/Brand";
import { baseUrl } from "../utils/Util";

export const getAllBrands = () => {
  return axios.get<ReturnValueBrand>(`${baseUrl}/brand`);
};
