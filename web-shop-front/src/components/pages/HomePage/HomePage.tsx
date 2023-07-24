import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import Brand from "../../../models/Brand";
import CategoryValues from "../../../models/CategoryValues";
import Item from "../../../models/Item";
import ItemType from "../../../models/ItemType";
import SortOption from "../../../models/SortOption";
import Tag from "../../../models/Tag";
import { getAllBrands } from "../../../services/brand-service";
import { getAllItems } from "../../../services/item-service";
import { getAllItemTypes } from "../../../services/item-types-service";
import { getAllTags } from "../../../services/tag-service";
import { createCategories, getSortOptions } from "../../../utils/Util";
import Navbar from "../../organisms/Navbar/Navbar";
import Products from "../../organisms/Products/Products";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import SidebarFilterMenu from "../../organisms/SidebarFilterMenu/SidebarFilterMenu";
import SidebarMobile from "../../organisms/SidebarMobile/SidebarMobile";

const HomePage = () => {
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedItemType, setSelectedItemType] = useState<ItemType>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<CategoryValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Item[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const tagsVar = getAllTags();
    const brandsVar = getAllBrands();
    setTags([...tagsVar]);
    setBrands([...brandsVar]);
    setItemTypes([...getAllItemTypes()]);
    setCategories([...createCategories(brandsVar, tagsVar)]);
    setSortOptions([...getSortOptions()]);
    setProducts([...getAllItems()]);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagsClick = (e: React.MouseEvent<HTMLElement>): void => {
    let tagName = e.currentTarget.title;
    const exist: Tag = selectedTags.filter((tag) => {
      return tag.name === tagName;
    })[0];
    if (exist === undefined) {
      const selected: Tag = tags.filter((tag) => {
        return tag.name === tagName;
      })[0];
      const selectedTagsVar = [...selectedTags, selected];
      setSelectedTags([...selectedTagsVar]);
      changeTagChecked(selected);
    } else {
      const selectedTagsVar = selectedTags.filter(
        (item) => item.name !== tagName
      );
      setSelectedTags([...selectedTagsVar]);
      changeTagChecked(exist);
    }
    // TODO: get all items for criteria
  };

  const changeTagChecked = (tag: Tag) => {
    for (let category of categories) {
      if (category.category === tag.description) {
        for (let value of category.values) {
          if (value.name === tag.name) {
            value.checked = !value.checked;
            break;
          }
        }
        break;
      }
    }
    setCategories(categories);
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLElement>) => {
    const brandName = e.currentTarget.title;
    const exist: Brand = selectedBrands.filter((brand) => {
      return brand.name === e.currentTarget.title;
    })[0];
    if (exist === undefined) {
      const selected: Brand = brands.filter((brand) => {
        return brand.name === brandName;
      })[0];
      const selectedBrandsVar = [...selectedBrands, selected];
      setSelectedBrands([...selectedBrandsVar]);
      changeBrandChecked(selected);
    } else {
      const selectedBrandsVar = selectedBrands.filter(
        (item) => item.name !== brandName
      );
      setSelectedBrands([...selectedBrandsVar]);
      changeBrandChecked(exist);
    }
    // TODO: get all items for chosen category
  };

  const changeBrandChecked = (brand: Brand) => {
    for (let category of categories) {
      if (category.category === "Brand") {
        for (let value of category.values) {
          if (value.name === brand.name) {
            value.checked = !value.checked;
            break;
          }
        }
        break;
      }
    }
    setCategories(categories);
  };

  const handleItemTypeClick = (e: React.MouseEvent<HTMLElement>): void => {
    const selected = itemTypes.filter((itemType) => {
      return itemType.name === e.currentTarget.id;
    })[0];
    setSelectedItemType(selected);
    // TODO: get all items for chosen category
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget.innerHTML);
  };

  const handlePageClick = (event: any) => {
    console.log(event);
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
            handlers={[handleBrandClick, handleTagsClick]}
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
                  handlers={[handleBrandClick, handleTagsClick]}
                />
                <div className="lg:col-span-3">
                  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <Products products={products} />
                    <ResponsivePagination
                      current={1}
                      total={100}
                      onPageChange={handlePageClick}
                      className="grid grid-cols-10 mt-11"
                    />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
