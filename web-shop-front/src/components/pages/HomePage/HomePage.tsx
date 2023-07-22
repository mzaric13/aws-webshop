import React, { useEffect, useState } from "react";
import Brand from "../../../models/Brand";
import CategoryValues from "../../../models/CategoryValues";
import ItemType from "../../../models/ItemType";
import Tag from "../../../models/Tag";
import { getAllBrands } from "../../../services/brand-service";
import { getAllItemTypes } from "../../../services/item-types-service";
import { getAllTags } from "../../../services/tag-service";
import { createCategories } from "../../../utils/Util";
import Navbar from "../../organisms/Navbar/Navbar";
import Sidebar from "../../organisms/Sidebar/Sidebar";

const HomePage = () => {
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const [selectedItemType, setSelectedItemType] = useState<ItemType>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<CategoryValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTags([...getAllTags()]);
    setBrands([...getAllBrands()]);
    setItemTypes([...getAllItemTypes()]);
    setCategories([
      ...createCategories(
        brands,
        itemTypes,
        tags,
        handleItemTypeClick,
        handleBrandClick,
        handleTagsClick
      ),
    ]);
    setIsLoading(false);
  }, []);

  const handleTagsClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    let category = e.target.name;
    console.log(category);
    if (categoriesSelected.includes(value))
      setCategoriesSelected(
        categoriesSelected.filter((item) => item !== value)
      );
    else
      setCategoriesSelected((categoriesSelected) => [
        ...categoriesSelected,
        value,
      ]);
    console.log(categoriesSelected);
    // TODO: get all items with selected tags
  };

  const handleBrandClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCategoriesSelected([]);
    setSelectedBrand(
      brands.filter((brand) => {
        return brand.name === e.target.value;
      })[0]
    );
    console.log("brand change");
    // TODO: get all items for chosen category
  };

  const handleItemTypeClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCategoriesSelected([]);
    setSelectedItemType(
      itemTypes.filter((itemType) => {
        return itemType.name === e.target.value;
      })[0]
    );
    console.log("item type change");
    // TODO: get all items for chosen category
  };

  return (
    <React.Fragment>
      <Navbar />
      <Sidebar
        selectedBrand={selectedBrand}
        selectedItemType={selectedItemType}
        categories={categories}
      />
    </React.Fragment>
  );
};

export default HomePage;
