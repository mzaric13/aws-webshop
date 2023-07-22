import Brand from "../models/Brand";
import CategoryValues from "../models/CategoryValues";
import ItemType from "../models/ItemType";
import Tag from "../models/Tag";

export const baseUrl: string = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL
  : "";

export const createCategories = (
  brands: Brand[],
  itemTypes: ItemType[],
  tags: Tag[],
  handleItemTypeClick: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleBrandClick: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleTagsClick: (e: React.ChangeEvent<HTMLInputElement>) => void
): CategoryValues[] => {
  let cats: CategoryValues[] = [];
  let valuesIt: string[] = [];
  for (let itemType of itemTypes) {
    valuesIt.push(itemType.name);
  }
  console.log(valuesIt);
  cats = [
    ...cats,
    {
      category: "Item type",
      values: valuesIt,
      handler: handleItemTypeClick,
    },
  ];
  console.log(cats);
  let valuesB: string[] = [];
  for (let brand of brands) {
    valuesB.push(brand.name);
  }
  cats = [
    ...cats,
    {
      category: "Brand",
      values: valuesB,
      handler: handleBrandClick,
    },
  ];

  let result = tags.reduce(function (r, a) {
    r[a.description] = r[a.description] || [];
    r[a.description].push(a.name);
    return r;
  }, Object.create(null));

  for (let cat in result) {
    cats = [
      ...cats,
      {
        category: cat,
        values: result[cat],
        handler: handleTagsClick,
      },
    ];
  }
  return cats;
};
