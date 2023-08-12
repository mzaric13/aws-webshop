export interface PriceListItem {
  priceListItemId: number;
  itemId: number;
  itemName: string;
  price: number;
}

export interface PriceList {
  id: number;
  valid: boolean;
  validFrom: Date;
  validTo: Date;
  priceListItems: PriceListItem[];
}

export interface PriceListReturnValue {
  numberOfPriceLists: number;
  priceLists: PriceList[];
}

export interface PriceListCreation {
  validTo: Date;
  priceListItems: PriceListItem[];
}

export interface PriceListUpdate {
  priceListId: number;
  validTo?: Date;
  priceListItems: PriceListItem[];
}
