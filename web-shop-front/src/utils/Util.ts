import Brand from "../models/Brand";
import CategoryValues, { ValueC } from "../models/CategoryValues";
import SortOption from "../models/SortOption";
import Tag from "../models/Tag";

export const baseUrl: string = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL
  : "";

export const getSortOptions = (): SortOption[] => {
  let s1: SortOption = { name: "A-Z", current: false };
  let s2: SortOption = { name: "Z-A", current: false };
  let s3: SortOption = { name: "Price: Low to High", current: false };
  let s4: SortOption = { name: "Price: High to Low", current: false };
  return [s1, s2, s3, s4];
};

export const createCategories = (
  brands: Brand[],
  tags: Tag[]
): CategoryValues[] => {
  let cats: CategoryValues[] = [];
  let valuesB: ValueC[] = [];
  for (let brand of brands) {
    valuesB.push({ name: brand.name, checked: false });
  }
  cats = [
    ...cats,
    {
      category: "Brand",
      values: valuesB,
      handlerIndex: 0,
    },
  ];

  let result = tags.reduce(function (r, a) {
    r[a.description] = r[a.description] || [];
    r[a.description].push({ name: a.name, checked: false });
    return r;
  }, Object.create(null));

  for (let cat in result) {
    cats = [
      ...cats,
      {
        category: cat,
        values: result[cat],
        handlerIndex: 1,
      },
    ];
  }
  return cats;
};
