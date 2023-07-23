import React, { useEffect, useState } from "react";
import Brand from "../../../models/Brand";
import CategoryValues from "../../../models/CategoryValues";
import ItemType from "../../../models/ItemType";
import SortOption from "../../../models/SortOption";
import Tag from "../../../models/Tag";
import { getAllBrands } from "../../../services/brand-service";
import { getAllItemTypes } from "../../../services/item-types-service";
import { getAllTags } from "../../../services/tag-service";
import { createCategories, getSortOptions } from "../../../utils/Util";
import Navbar from "../../organisms/Navbar/Navbar";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import SidebarFilterMenu from "../../organisms/SidebarFilterMenu/SidebarFilterMenu";
import SidebarMobile from "../../organisms/SidebarMobile/SidebarMobile";

const HomePage = () => {
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    const tgs = getAllTags();
    const brds = getAllBrands();
    const ittps = getAllItemTypes();
    setTags([...tgs]);
    setBrands([...brds]);
    setItemTypes([...ittps]);
    setCategories([
      ...createCategories(brds, tgs, handleBrandClick, handleTagsClick),
    ]);
    setSortOptions(getSortOptions());
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleItemTypeClick = (e: React.MouseEvent<HTMLElement>): void => {
    setCategoriesSelected([]);
    setSelectedItemType(
      itemTypes.filter((itemType) => {
        return itemType.name === e.currentTarget.id;
      })[0]
    );
    console.log("item type change: " + e.currentTarget.id);
    // TODO: get all items for chosen category
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log("sort option changed");
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="bg-white">
        <div>
          <SidebarMobile
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            itemTypes={itemTypes}
            categories={categories}
            handleItemTypeClick={handleItemTypeClick}
          />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SidebarFilterMenu
              setMobileFiltersOpen={setMobileFiltersOpen}
              sortOptions={sortOptions}
              handleClick={handleSortClick}
            />
            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                <Sidebar
                  mobile={false}
                  itemTypes={itemTypes}
                  itemTypesHandler={handleItemTypeClick}
                  categories={categories}
                />
                <div className="lg:col-span-3"></div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
