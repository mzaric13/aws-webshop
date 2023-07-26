import axios from "axios";
import { ReturnValueItemType } from "../models/ItemType";
import { baseUrl } from "../utils/Util";

export const getAllItemTypes = () => {
  return axios.get<ReturnValueItemType>(`${baseUrl}/items/item-types`);
};
