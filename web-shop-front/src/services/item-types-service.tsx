import ItemType from "../models/ItemType";

export const getAllItemTypes = () => {
  let t1: ItemType = {
    id: 1,
    name: "SHOES",
  };
  let t2: ItemType = {
    id: 2,
    name: "CLOTHES",
  };
  let t3: ItemType = {
    id: 3,
    name: "EQUIPMENT",
  };
  return [t1, t2, t3];
};
