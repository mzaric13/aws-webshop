import Item from "./Item";

export interface ShoppingCartItem {
  quantity: number;
  item: Item;
  itemSize?: string;
}
