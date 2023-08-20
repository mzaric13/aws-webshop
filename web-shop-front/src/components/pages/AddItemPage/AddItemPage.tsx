import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Brand from "../../../models/Brand";
import { ItemCreation } from "../../../models/Item";
import ItemAvailability from "../../../models/ItemAvailability";
import ItemType from "../../../models/ItemType";
import Tag from "../../../models/Tag";
import { getAllBrands } from "../../../services/brand-service";
import { addItem } from "../../../services/item-service";
import { getAllItemTypes } from "../../../services/item-types-service";
import { getAllTags } from "../../../services/tag-service";
import { getNavbarLinks } from "../../../utils/Util";
import { validateItemData } from "../../../utils/Validator";
import Button from "../../atoms/Button/Button";
import AddItemAdvanced from "../../organisms/AddItemAdvanced/AddItemAdvanced";
import AddItemBasic from "../../organisms/AddItemBasic/AddItemBasic";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Navbar from "../../organisms/Navbar/Navbar";

const AddItemPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advancedPage, setAdvancedPage] = useState<boolean>(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itemType: { id: -1, name: "" },
    brand: { id: -1, name: "" },
    sizes: [{ name: "" }],
    tags: [{ id: -1, name: "", description: "" }],
    pictures: [],
    price: 0,
    itemAvailabilities: [{ itemSize: "", numberOfItemsLeft: 0 }],
  });

  useEffect(() => {
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
        setIsLoading(false);
        setItemTypes([...res.data.body]);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Item types not read");
      });
  }, []);

  const handleItemTypeChange = (newItemType: ItemType) => {
    let newSizes: any[] = [];
    if (newItemType.name !== formData.itemType.name) newSizes = [];
    else newSizes = formData.sizes;
    const newFormData = {
      ...formData,
      itemType: newItemType,
      sizes: newSizes,
    };
    setFormData(newFormData);
  };

  const handleBrandChange = (newBrand: Brand) => {
    const newFormData = {
      ...formData,
      brand: newBrand,
    };
    setFormData(newFormData);
  };

  const handleTagsChange = (newTags: Tag[]) => {
    const newFormData = {
      ...formData,
      tags: newTags,
    };
    setFormData(newFormData);
  };

  const handleSizesChange = (newSizes: any[]) => {
    const newFormData = {
      ...formData,
      sizes: newSizes,
    };
    setFormData(newFormData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value;
    if (name === "price") {
      value = Number(event.target.value);
    } else {
      value = event.target.value;
    }
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
  };

  const handleInputChangeForAvailabilities = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (formData.itemType.name === "EQUIPMENT") {
      const itemAvailability: ItemAvailability = {
        itemSize: "ALL",
        numberOfItemsLeft: Number(event.target.value),
      };
      const newFormData = {
        ...formData,
        itemAvailabilities: [itemAvailability],
      };
      setFormData(newFormData);
    } else {
      const exist: ItemAvailability = formData.itemAvailabilities.filter(
        (itemAvailability) => {
          return itemAvailability.itemSize === event.target.name;
        }
      )[0];
      if (exist === undefined) {
        const itemAvailability: ItemAvailability = {
          itemSize: event.target.name,
          numberOfItemsLeft: Number(event.target.value),
        };
        const newFormData = {
          ...formData,
          itemAvailabilities: [
            ...formData.itemAvailabilities,
            itemAvailability,
          ],
        };
        setFormData(newFormData);
      } else {
        let itemAvailability = formData.itemAvailabilities.filter(
          (item) => item.itemSize !== event.target.name
        );
        itemAvailability.push({
          itemSize: event.target.name,
          numberOfItemsLeft: Number(event.target.value),
        });
        const newFormData = {
          ...formData,
          itemAvailabilities: itemAvailability,
        };
        setFormData(newFormData);
      }
    }
  };

  const handleAdvancePage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newFormData = {
      ...formData,
      itemAvailabilities: [],
      price: 0,
    };
    setFormData(newFormData);
    setAdvancedPage(!advancedPage);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const message = validateItemData(formData);
    if (message === "Success") {
      const itemCreation: ItemCreation = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        itemType: formData.itemType,
        itemAvailabilities: formData.itemAvailabilities,
        price: formData.price,
        pictures: formData.pictures,
        sizes: formData.sizes.map((size) => size.name),
        tags: formData.tags,
      };
      addItem(itemCreation)
        .then((res) => {
          if (res.data.statusCode === 200) {
            toast.success(res.data.message);
            navigate("/admin-products");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      toast.error(message);
    }
    event.preventDefault();
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("ADMIN")} />
          <form onSubmit={handleSubmit}>
            <div className="items-center justify-center px-6 py-8 mt-10 mx-60 md:h-min lg:py-0">
              <div className="border-b-2 border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900 mb-10">
                  {advancedPage
                    ? "Additional product information"
                    : "Product information"}
                </h2>
                {advancedPage ? (
                  <AddItemAdvanced
                    sizes={formData.sizes}
                    selectedItemType={formData.itemType}
                    handleInputChange={handleInputChange}
                    handleSizeInputChange={handleInputChangeForAvailabilities}
                  />
                ) : (
                  <AddItemBasic
                    brands={brands}
                    tags={tags}
                    itemTypes={itemTypes}
                    selectedItemType={formData.itemType}
                    selectedBrand={formData.brand}
                    selectedTags={formData.tags}
                    selectedSizes={formData.sizes}
                    handleInputChange={handleInputChange}
                    handleItemTypeChange={handleItemTypeChange}
                    handleBrandChange={handleBrandChange}
                    handleTagsChange={handleTagsChange}
                    handleSizeChange={handleSizesChange}
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6 mx-64">
              {advancedPage ? (
                <React.Fragment>
                  <Button
                    type="back"
                    text="Back"
                    handleClick={handleAdvancePage}
                  />
                  <Button type="submit" text="Add item" />
                </React.Fragment>
              ) : (
                <Button
                  type="button"
                  text="Next"
                  handleClick={handleAdvancePage}
                />
              )}
            </div>
          </form>
        </React.Fragment>
      )}
    </>
  );
};

export default AddItemPage;
