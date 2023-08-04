import React, { Dispatch, SetStateAction } from "react";
import Item, { ItemAdditionalData } from "../../../models/Item";
import Button from "../../atoms/Button/Button";
import SizeFields from "../../molecules/SizeFields/SizeFields";

interface ProductInfoSectionProps {
  itemBasicData: Item;
  itemAdditionalData: ItemAdditionalData;
  chosenSize: string;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  handleSizeClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleAddToCartClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProductInfoSection = ({
  itemBasicData,
  itemAdditionalData,
  chosenSize,
  quantity,
  setQuantity,
  handleSizeClick,
  handleAddToCartClick,
}: ProductInfoSectionProps) => {
  const decreaseQuantity = () => {
    setQuantity((quantity) => (quantity === 1 ? quantity : quantity - 1));
  };

  const increaseQuantity = () => {
    if (chosenSize === "") {
      const ia = itemAdditionalData.itemAvailabilities[0];
      if (ia.numberOfItemsLeft >= quantity + 1)
        setQuantity((quantity) => quantity + 1);
    } else {
      const ia = itemAdditionalData.itemAvailabilities.filter(
        (itemAvailability) => itemAvailability.itemSize === chosenSize
      )[0];
      if (ia.numberOfItemsLeft >= quantity + 1)
        setQuantity((quantity) => quantity + 1);
    }
  };

  return (
    <React.Fragment>
      <div>
        <h1 className="text-3xl font-bold">{itemBasicData.name}</h1>
      </div>
      <p className="text-gray-700">{itemBasicData.description}</p>
      {itemAdditionalData.sizes.length !== 0 ? (
        <SizeFields
          sizes={itemAdditionalData.sizes}
          itemAvailabilities={itemAdditionalData.itemAvailabilities}
          chosenSize={chosenSize}
          handleSizeClick={handleSizeClick}
        />
      ) : (
        <></>
      )}

      <h6 className="mt-6 text-2xl font-semibold">$ {itemBasicData.price}</h6>
      <div className="flex flex-row items-center gap-12">
        <div className="flex flex-row items-center">
          <Button type="minus" leftRightHandler={decreaseQuantity} />
          <span className="py-4 px-6 rounded-lg">{quantity}</span>
          <Button type="plus" leftRightHandler={increaseQuantity} />
        </div>
      </div>
      <Button
        type="add-cart"
        handleClick={handleAddToCartClick}
        text="Add to cart"
      />
    </React.Fragment>
  );
};

export default ProductInfoSection;
