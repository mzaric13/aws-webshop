import Item from "../models/Item";

export const getAllItems = () => {
  const i1: Item = {
    id: 1,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  const i2: Item = {
    id: 2,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  const i3: Item = {
    id: 3,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  const i4: Item = {
    id: 4,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  const i5: Item = {
    id: 5,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  const i6: Item = {
    id: 6,
    name: "NIKE AIR ZOOM CROSSOVER",
    description: "Basketball deep shoes",
    price: 15.4,
  };
  return [i1, i2, i3, i4, i5, i6];
};
