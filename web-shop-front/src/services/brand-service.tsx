import Brand from "../models/Brand";

export const getAllBrands = () => {
  let b1: Brand = {
    id: 1,
    name: "NIKE",
  };
  let b2: Brand = {
    id: 2,
    name: "ADIDAS",
  };
  let b3: Brand = {
    id: 3,
    name: "PUMA",
  };
  return [b1, b2, b3];
};
