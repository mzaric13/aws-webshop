import axios from "axios";
import Brand from "../models/Brand";
import { ReturnValueItems } from "../models/Item";
import ItemType from "../models/ItemType";
import SearchData from "../models/SearchData";
import Tag from "../models/Tag";
import { baseUrl } from "../utils/Util";

export const getAllItems = (
  page: number,
  pageSize: number,
  itemType: ItemType | undefined,
  brands: Brand[],
  tags: Tag[],
  sortOption: string
) => {
  const searchData: SearchData = {
    page: page,
    pageSize: pageSize,
    itemType: itemType,
    brands: brands,
    tags: tags,
    sortOption: sortOption,
  };
  console.log(sortOption);
  return axios.post<ReturnValueItems>(`${baseUrl}/items`, searchData);
};
