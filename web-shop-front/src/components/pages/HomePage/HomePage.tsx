import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { getRole } from "../../../services/token-service";
import {
  createCategories,
  getNavbarLinks,
  getSortOptions,
} from "../../../utils/Util";
import Pagination from "../../molecules/Pagination/Pagination";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Navbar from "../../organisms/Navbar/Navbar";
import Products from "../../organisms/Products/Products";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import SidebarFilterMenu from "../../organisms/SidebarFilterMenu/SidebarFilterMenu";
import SidebarMobile from "../../organisms/SidebarMobile/SidebarMobile";

const HomePage = () => {
  const pageSize: number = 8;

  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("");
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedItemType, setSelectedItemType] = useState<ItemType>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<CategoryValues[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Item[]>([]);
  const [numberOfProductsForFilter, setNumberOfProductsForFilter] =
    useState<number>(0);
  const [noItemsText, setNoItemsText] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    setSortOptions([...getSortOptions()]);
    getAllItems(
      page,
      pageSize,
      selectedItemType,
      selectedBrands,
      selectedTags,
      sortOption
    )
      .then((res) => {
        setIsLoading(false);
        setNumberOfProductsForFilter(res.data.body.numberOfItems);
        if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");
        setProducts([...res.data.body.items]);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Products not read");
      });
    getAllTags()
      .then((res) => {
        setTags([...res.data.body]);
      })
      .catch((err) => {
        toast.error("Tags not read");
      });
    getAllBrands()
      .then((res) => {
        setBrands([...res.data.body]);
      })
      .catch((err) => {
        toast.error("Brands not read");
      });
    getAllItemTypes()
      .then((res) => {
        setItemTypes([...res.data.body]);
      })
      .catch((err) => {
        toast.error("Item types not read");
      });
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
      getItemsForBrandAndTags(selectedBrands, selectedTagsVar);
    } else {
      const selectedTagsVar = selectedTags.filter(
        (item) => item.name !== tagName
      );
      setSelectedTags([...selectedTagsVar]);
      getItemsForBrandAndTags(selectedBrands, selectedTagsVar);
    }
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
      getItemsForBrandAndTags(selectedBrandsVar, selectedTags);
    } else {
      const selectedBrandsVar = selectedBrands.filter(
        (item) => item.name !== brandName
      );
      setSelectedBrands([...selectedBrandsVar]);
      getItemsForBrandAndTags(selectedBrandsVar, selectedTags);
    }
  };

  const getItemsForBrandAndTags = (brands: Brand[], tags: Tag[]) => {
    setPage(1);
    getAllItems(1, pageSize, selectedItemType, brands, tags, sortOption)
      .then((res) => {
        if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");
        setProducts([...res.data.body.items]);
        setNumberOfProductsForFilter(res.data.body.numberOfItems);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const handleItemTypeClick = (e: React.MouseEvent<HTMLElement>): void => {
    setSelectedBrands([]);
    setSelectedTags([]);
    const selected = itemTypes.filter((itemType) => {
      return itemType.name === e.currentTarget.id;
    })[0];
    setSortOption("");
    selectSortOption("");
    setSelectedItemType(selected);
    resetCategories();
    getAllItems(1, pageSize, selected, [], [], "")
      .then((res) => {
        setIsLoading(false);
        if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");
        setProducts([...res.data.body.items]);
        setNumberOfProductsForFilter(res.data.body.numberOfItems);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    const sort = event.currentTarget.innerHTML;
    setSortOption(sort);
    setPage(1);
    selectSortOption(sort);
    getAllItems(
      1,
      pageSize,
      selectedItemType,
      selectedBrands,
      selectedTags,
      sort
    )
      .then((res) => {
        setIsLoading(false);
        if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");
        console.log([...res.data.body.items]);
        setProducts([...res.data.body.items]);
        setNumberOfProductsForFilter(res.data.body.numberOfItems);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const selectSortOption = (sort: string) => {
    const sortOpts = [...sortOptions];
    for (let so of sortOpts) {
      if (so.name === sort) {
        so.current = true;
      } else {
        so.current = false;
      }
    }
    setSortOptions([...sortOpts]);
  };

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    getAllItems(
      newPage,
      pageSize,
      selectedItemType,
      selectedBrands,
      selectedTags,
      sortOption
    )
      .then((res) => {
        setIsLoading(false);
        if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");
        setProducts([...res.data.body.items]);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const handleClick = (number: string) => {
    if (
      (number === "Previous" && page === 1) ||
      (number === "Next" &&
        page === Math.ceil(numberOfProductsForFilter / pageSize))
    ) {
      return;
    } else {
      let newPage: number = 0;
      if (number === "Previous") newPage = page - 1;
      else if (number === "Next") newPage = page + 1;
      else newPage = Number(number);
      handlePageClick(newPage);
    }
  };

  const resetCategories = () => {
    for (let category of categories) {
      for (let value of category.values) value.checked = false;
    }
    setCategories([...categories]);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar
            navbarLinks={getNavbarLinks(getRole() as unknown as string)}
          />
          <div className="bg-white">
            <div>
              <SidebarMobile
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                itemTypes={itemTypes}
                categories={createCategories(
                  brands,
                  tags,
                  selectedBrands,
                  selectedTags
                )}
                handleItemTypeClick={handleItemTypeClick}
                handlers={[handleBrandClick, handleTagsClick]}
              />
              <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SidebarFilterMenu
                  setMobileFiltersOpen={setMobileFiltersOpen}
                  sortOptions={sortOptions}
                  handleClick={handleSortClick}
                />
                <section
                  aria-labelledby="products-heading"
                  className="pb-24 pt-6"
                >
                  <h2 id="products-heading" className="sr-only">
                    Products
                  </h2>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    <Sidebar
                      mobile={false}
                      itemTypes={itemTypes}
                      itemTypesHandler={handleItemTypeClick}
                      categories={createCategories(
                        brands,
                        tags,
                        selectedBrands,
                        selectedTags
                      )}
                      handlers={[handleBrandClick, handleTagsClick]}
                    />
                    <div className="lg:col-span-3">
                      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                          {noItemsText}
                        </h2>
                        <Products products={products} />
                        <Pagination
                          page={page}
                          numberOfPages={Math.ceil(
                            numberOfProductsForFilter / pageSize
                          )}
                          onPageClick={handleClick}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default HomePage;
