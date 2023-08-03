import Brand from "./Brand";
import ItemAvailability from "./ItemAvailability";
import ItemType from "./ItemType";
import Tag from "./Tag";

export interface ReturnValueItemBody {
  items: Item[];
  numberOfItems: number;
}

export interface ReturnValueItems {
  statusCode: number;
  body: ReturnValueItemBody;
}

export interface ItemCreation {
  name: string;
  description: string;
  pictures?: string[];
  itemType: ItemType;
  brand: Brand;
  tags: Tag[];
  sizes: string[];
  price: number;
  itemAvailabilities: ItemAvailability[];
}

export interface ReturnValueItemAdditionalData {
  statusCode: number;
  body: ItemAdditionalData[];
}

export interface ItemAdditionalData {
  itemId: number;
  itemAvailabilities: ItemAvailability[];
  sizes: string[];
  tagIds: number[];
}

export interface UpdateItem {
  id: number;
  itemTypeId: number;
  name: string;
  description: string;
  brandId: number;
  itemAvailabilities: ItemAvailability[];
  sizes: string[];
  tagIds: number[];
}

export interface ReturnByIdItem {
  statusCode: number;
  body: Item;
}

interface Item {
  id: number;
  name: string;
  description: string;
  pictures?: string[];
  price: number;
  itemTypeId: number;
  brandId: number;
}

export default Item;
