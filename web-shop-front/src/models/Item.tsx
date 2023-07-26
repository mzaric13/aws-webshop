export interface ReturnValueItemBody {
  items: Item[];
  numberOfItems: number;
}

export interface ReturnValueItems {
  statusCode: number;
  body: ReturnValueItemBody;
}

interface Item {
  id: number;
  name: string;
  description: string;
  pictures?: string[];
  price: number;
}

export default Item;
