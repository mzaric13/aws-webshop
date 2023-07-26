export interface ReturnValueItemType {
  statusCode: number;
  body: ItemType[];
}

interface ItemType {
  id: number;
  name: string;
}

export default ItemType;
