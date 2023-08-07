import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import Item, { ItemAdditionalData } from "../../../models/Item";
import {
  getAdditionalItemData,
  getItemById,
} from "../../../services/item-service";
import { getNavbarLinks } from "../../../utils/Util";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Navbar from "../../organisms/Navbar/Navbar";
import ProductImageSection from "../../organisms/ProductImageSection/ProductImageSection";
import ProductInfoSection from "../../organisms/ProductInfoSection/ProductInfoSection";

const ProductPage = () => {
  const { itemId } = useParams();
  const { addToCart } = useShoppingCart();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [itemBasicData, setItemBasicData] = useState<Item>({
    id: -1,
    brandId: -1,
    description: "",
    itemTypeId: -1,
    name: "",
    price: 0,
    pictures: [],
  });
  const [itemAdditionalData, setItemAdditionalData] =
    useState<ItemAdditionalData>({
      itemId: -1,
      sizes: [],
      tagIds: [],
      itemAvailabilities: [],
    });
  const [chosenSize, setChosenSize] = useState<string>("");

  useEffect(() => {
    getItemById(itemId as unknown as number).then((res) => {
      if (res.data.statusCode === 200) {
        const itemBasic = res.data.body;
        setItemBasicData(itemBasic);
        getAdditionalItemData([itemBasic])
          .then((res) => {
            setIsLoading(false);
            if (res.data.statusCode === 200) {
              setItemAdditionalData(res.data.body[0]);
            } else {
              toast.error("Internal server error");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error("Internal server error");
          });
      } else {
        setIsLoading(false);
        toast.error("Error loading data");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSizeClick = (event: React.MouseEvent<HTMLElement>) => {
    setChosenSize(event.currentTarget.id);
    event.preventDefault();
  };

  const handleAddToCartClick = (event: React.MouseEvent<HTMLElement>) => {
    if (itemBasicData.itemTypeId !== 3 && chosenSize === "") {
      toast.info("Size is not selected", { position: "top-right" });
    } else {
      addToCart(itemBasicData, chosenSize, quantity);
      event.preventDefault();
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("User")} />
          <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center mt-36 mx-36">
            <div className="flex flex-col gap-6 lg:w-2/4">
              <ProductImageSection
                pictures={
                  itemBasicData.pictures
                    ? itemBasicData.pictures
                    : ["/no-image-available.jpeg"]
                }
              />
            </div>
            <div className="flex flex-col gap-4 lg:w-2/4">
              <ProductInfoSection
                itemBasicData={itemBasicData}
                itemAdditionalData={itemAdditionalData}
                chosenSize={chosenSize}
                quantity={quantity}
                setQuantity={setQuantity}
                handleSizeClick={handleSizeClick}
                handleAddToCartClick={handleAddToCartClick}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProductPage;
