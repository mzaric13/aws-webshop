import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Brand from "../../../models/Brand";
import Item, { ItemAdditionalData, UpdateItem } from "../../../models/Item";
import Tag from "../../../models/Tag";
import { getAllBrands } from "../../../services/brand-service";
import {
  getAdditionalItemData,
  getAllItems,
  updateItem,
} from "../../../services/item-service";
import { getAllTags } from "../../../services/tag-service";
import { getNavbarLinks } from "../../../utils/Util";
import { validateUpdateItemData } from "../../../utils/Validator";
import Pagination from "../../molecules/Pagination/Pagination";
import AdminPagesHeader from "../../organisms/AdminPagesHeader/AdminPagesHeader";
import EditItem from "../../organisms/EditItem/EditItem";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Modal from "../../organisms/Modal/Modal";
import Navbar from "../../organisms/Navbar/Navbar";
import ProductsTable from "../../organisms/ProductsTable/ProductsTable";

const AdminHomePage = () => {
  const pageSize: number = 10;

  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [numberOfItems, setNumberOfItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Item[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [additionalItemData, setAdditionalItemData] = useState<
    ItemAdditionalData[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<Item>({
    id: -1,
    brandId: -1,
    description: "",
    itemTypeId: -1,
    name: "",
    price: 0,
    pictures: [],
  });
  const [selectedItemAdditionalData, setSelectedItemAdditionalData] =
    useState<ItemAdditionalData>({
      tagIds: [],
      sizes: [],
      itemId: -1,
      itemAvailabilities: [],
    });
  const [showModal, setShowModal] = useState<boolean>(false);

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
    let items: Item[] = [];
    getAllItems(page, pageSize, undefined, [], [], "")
      .then((res) => {
        items = res.data.body.items;
        setNumberOfItems(res.data.body.numberOfItems);
        setProducts([...items]);
        getAdditionalItemData(items)
          .then((res) => {
            setIsLoading(false);
            setAdditionalItemData([...res.data.body]);
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error("Products additional data not read");
          });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Products not read");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    getAllItems(newPage, pageSize, undefined, [], [], "")
      .then((res) => {
        const items = res.data.body.items;
        setProducts([...items]);
        getAdditionalItemData(items)
          .then((res) => {
            setIsLoading(false);
            setAdditionalItemData([...res.data.body]);
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error("Products additional data not read");
          });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const handleClick = (number: string) => {
    if (
      (number === "Previous" && page === 1) ||
      (number === "Next" && page === Math.ceil(numberOfItems / pageSize))
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

  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/add-product");
  };

  const resetSelectedItem = () => {
    setSelectedItem({
      id: -1,
      brandId: -1,
      description: "",
      itemTypeId: -1,
      name: "",
      price: 0,
      pictures: [],
    });
    setSelectedItemAdditionalData({
      tagIds: [],
      sizes: [],
      itemId: -1,
      itemAvailabilities: [],
    });
  };

  const handleEditClick = (itemId: number) => {
    const item = products.filter((item) => {
      return item.id === itemId;
    });
    const additionalData = additionalItemData.filter((item) => {
      return item.itemId === itemId;
    });
    setShowModal(true);
    setSelectedItem(item[0]);
    setSelectedItemAdditionalData(additionalData[0]);
  };

  const closeModal = () => {
    resetSelectedItem();
    setShowModal(false);
  };

  const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    closeModal();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleBrandChange = (newBrand: Brand) => {
    setSelectedItem({ ...selectedItem, brandId: newBrand.id });
  };

  const handleTagsChange = (newTags: Tag[]) => {
    setSelectedItemAdditionalData({
      ...selectedItemAdditionalData,
      tagIds: newTags.map((tag) => {
        return tag.id;
      }),
    });
  };

  const handleSizesChange = (newSizes: any[]) => {
    const sizes = newSizes.map((size) => size.name);
    const newS = sizes.filter(
      (size) => !selectedItemAdditionalData.sizes.includes(size)
    );
    let contained = selectedItemAdditionalData.itemAvailabilities.filter(
      (itemAvailability) => sizes.includes(itemAvailability.itemSize)
    );
    for (let s of newS) {
      contained.push({ itemSize: s, numberOfItemsLeft: 0 });
    }
    setSelectedItemAdditionalData({
      ...selectedItemAdditionalData,
      sizes: sizes,
      itemAvailabilities: [...contained],
    });
  };

  const handleInputChangeForAvailabilities = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (selectedItem.itemTypeId === 3) {
      let newItemAvailability =
        selectedItemAdditionalData.itemAvailabilities[0];
      newItemAvailability.numberOfItemsLeft = value;
      setSelectedItemAdditionalData({
        ...selectedItemAdditionalData,
        itemAvailabilities: [newItemAvailability],
      });
    } else {
      const name = event.target.name;
      let newItemAvailabilies =
        selectedItemAdditionalData.itemAvailabilities.filter(
          (itemA) => itemA.itemSize !== name
        );
      newItemAvailabilies = [
        ...newItemAvailabilies,
        { numberOfItemsLeft: value, itemSize: name },
      ];
      setSelectedItemAdditionalData({
        ...selectedItemAdditionalData,
        itemAvailabilities: [...newItemAvailabilies],
      });
    }
  };

  const handleSaveItem = (event: FormEvent<HTMLFormElement>) => {
    const updateItemData: UpdateItem = {
      id: selectedItem.id,
      brandId: selectedItem.brandId,
      description: selectedItem.description,
      itemAvailabilities: selectedItemAdditionalData.itemAvailabilities,
      itemTypeId: selectedItem.itemTypeId,
      name: selectedItem.name,
      sizes: selectedItemAdditionalData.sizes,
      tagIds: selectedItemAdditionalData.tagIds,
    };
    const message = validateUpdateItemData(updateItemData);
    if (message === "Success") {
      updateItem(updateItemData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            toast.success(res.data.message);
            closeModal();
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error("Server error");
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
          <AdminPagesHeader
            text="Products"
            handleClick={handleAddButtonClick}
            buttonText="Add item"
          />
          <div className="grid grid-cols-6 overflow-auto rounded-lg">
            <ProductsTable items={products} onClick={handleEditClick} />
            <div className="col-start-2 col-span-4">
              <Pagination
                page={page}
                numberOfPages={Math.ceil(numberOfItems / pageSize)}
                onPageClick={handleClick}
              />
            </div>
          </div>
          {showModal ? (
            <Modal
              show={showModal}
              modalHeaderText="Edit product"
              handleCloseModal={handleCloseModal}
            >
              <EditItem
                selectedItem={selectedItem}
                selectedItemAdditionalData={selectedItemAdditionalData}
                brands={brands}
                tags={tags}
                handleBrandChange={handleBrandChange}
                handleInputChange={handleInputChange}
                handleSizeChange={handleSizesChange}
                handleTagsChange={handleTagsChange}
                handleSubmit={handleSaveItem}
                handleInputChangeForAvailabilities={
                  handleInputChangeForAvailabilities
                }
              />
            </Modal>
          ) : (
            <></>
          )}
        </React.Fragment>
      )}
    </>
  );
};

export default AdminHomePage;
