import Brand from "../models/Brand";
import CategoryValues, { ValueC } from "../models/CategoryValues";
import NavbarLinks from "../models/NavbarLinks";
import SortOption from "../models/SortOption";
import Tag from "../models/Tag";

export const baseUrl: string = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
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
  tags: Tag[],
  selectedBrands: Brand[],
  selectedTags: Tag[]
): CategoryValues[] => {
  let cats: CategoryValues[] = [];
  let valuesB: ValueC[] = [];
  for (let brand of brands) {
    valuesB.push({
      name: brand.name,
      checked: selectedBrands.includes(brand) ? true : false,
    });
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
    r[a.description].push({
      name: a.name,
      checked: selectedTags.includes(a) ? true : false,
    });
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

export const getNavbarLinks = (role: string): NavbarLinks[] => {
  const l1: NavbarLinks = { text: "Home", linkTo: "/" };
  const l2: NavbarLinks = { text: "Sign In", linkTo: "/login" };
  const l3: NavbarLinks = { text: "Create account", linkTo: "/signup" };
  const l4: NavbarLinks = { text: "Products", linkTo: "/products" };
  const l5: NavbarLinks = { text: "My orders", linkTo: "/my-orders" };
  const l6: NavbarLinks = { text: "My account", linkTo: "/account" };
  const l7: NavbarLinks = { text: "Products", linkTo: "/admin-products" };
  const l8: NavbarLinks = { text: "Orders", linkTo: "/admin-orders" };
  const l9: NavbarLinks = { text: "Users", linkTo: "/admin-users" };
  const l10: NavbarLinks = { text: "Reports", linkTo: "/admin-reports" };
  if (role === "User") {
    return [l4, l5, l6];
  } else if (role === "Admin") {
    return [l7, l8, l9, l10];
  }
  return [l1, l2, l3];
};
