import Brand from "../models/Brand";
import CategoryValues, { ValueC } from "../models/CategoryValues";
import NavbarLinks from "../models/NavbarLinks";
import { OrderItem } from "../models/Order";
import { ShoppingCartItem } from "../models/ShoppingCart";
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
  return [l1, l3];
};

export const getClothesSizes = () => {
  return [
    { name: "XS" },
    { name: "S" },
    { name: "M" },
    { name: "L" },
    { name: "XL" },
    { name: "XXL" },
    { name: "3XL" },
  ];
};

export const getShoesSizes = () => {
  return [
    { name: "34" },
    { name: "35" },
    { name: "36" },
    { name: "37" },
    { name: "38" },
    { name: "39" },
    { name: "40" },
    { name: "41" },
    { name: "42" },
    { name: "43" },
    { name: "44" },
    { name: "45" },
    { name: "46" },
    { name: "47" },
    { name: "48" },
    { name: "49" },
  ];
};

export const createOrderItems = (cartItems: ShoppingCartItem[]) => {
  let orderItems: OrderItem[] = [];
  for (let cartItem of cartItems) {
    const orderItem: OrderItem = {
      itemId: cartItem.item.id,
      itemSize: cartItem.itemSize ? cartItem.itemSize : "",
      price: cartItem.quantity * cartItem.item.price,
      quantity: cartItem.quantity,
    };
    orderItems.push(orderItem);
  }
  return orderItems;
};
