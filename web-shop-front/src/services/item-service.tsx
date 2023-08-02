import axios from "axios";
import Brand from "../models/Brand";
import Item, {
  ItemCreation,
  ReturnValueItemAdditionalData,
  ReturnValueItems,
  UpdateItem,
} from "../models/Item";
import ItemType from "../models/ItemType";
import SearchData from "../models/SearchData";
import Tag from "../models/Tag";
import { SignUpReturnValue } from "../models/User";
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
  return axios.post<ReturnValueItems>(`${baseUrl}/items`, searchData);
};

export const addItem = (itemCreation: ItemCreation) => {
  return axios.post<SignUpReturnValue>(
    `${baseUrl}/items/add-item`,
    itemCreation
  );
};

export const getAdditionalItemData = (items: Item[]) => {
  const idList = items.map((item) => item.id);
  return axios.post<ReturnValueItemAdditionalData>(
    `${baseUrl}/items/get-add-data`,
    { idList: idList }
  );
};

export const updateItem = (updateItem: UpdateItem) => {
  return axios.put<SignUpReturnValue>(`${baseUrl}/items`, updateItem);
};
