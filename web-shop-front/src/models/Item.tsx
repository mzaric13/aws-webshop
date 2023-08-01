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

interface Item {
  id: number;
  name: string;
  description: string;
  pictures?: string[];
  price: number;
}

export default Item;
