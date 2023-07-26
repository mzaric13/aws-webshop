import axios from "axios";
import { ReturnValueTags } from "../models/Tag";
import { baseUrl } from "../utils/Util";

export const getAllTags = () => {
  return axios.get<ReturnValueTags>(`${baseUrl}/tag`);
};
