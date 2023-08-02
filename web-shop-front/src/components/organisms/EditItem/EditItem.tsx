import { FormEvent } from "react";
import Brand from "../../../models/Brand";
import Item, { ItemAdditionalData } from "../../../models/Item";
import Tag from "../../../models/Tag";
import { getClothesSizes, getShoesSizes } from "../../../utils/Util";
import Button from "../../atoms/Button/Button";
import FormField from "../../molecules/FormField/FormField";

interface EditItemProps {
  selectedItem: Item;
  selectedItemAdditionalData: ItemAdditionalData;
  brands: Brand[];
  tags: Tag[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBrandChange: (b: Brand) => void;
  handleTagsChange: (tags: Tag[]) => void;
  handleSizeChange: (size: any) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChangeForAvailabilities: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const EditItem = ({
  selectedItem,
  selectedItemAdditionalData,
  brands,
  tags,
  handleInputChange,
  handleBrandChange,
  handleTagsChange,
  handleSizeChange,
  handleSubmit,
  handleInputChangeForAvailabilities,
}: EditItemProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <FormField
          text="Name"
          name="name"
          type="text"
          fieldType="medium"
          handleInputChange={handleInputChange}
          value={selectedItem.name}
        />
        <FormField
          text="Brand"
          name="brand"
          type="select"
          fieldType="medium"
          handleInputChange={handleInputChange}
          options={brands}
          handleSelectChange={handleBrandChange}
          selectedValue={brands.filter(
            (brand) => brand.id === selectedItem.brandId
          )}
        />
        <FormField
          text="Description"
          type="text"
          name="description"
          fieldType="big"
          handleInputChange={handleInputChange}
          value={selectedItem.description}
        />
        <FormField
          text="Tags"
          type="multi"
          name="tags"
          fieldType="big"
          handleInputChange={handleInputChange}
          options={tags}
          handleSelectChange={handleTagsChange}
          selectedValue={tags.filter((tag) =>
            selectedItemAdditionalData.tagIds.includes(tag.id)
          )}
        />
        {selectedItem.itemTypeId !== 3 && selectedItem.itemTypeId !== -1 ? (
          <FormField
            text="Sizes"
            name="sizes"
            type="multi"
            fieldType="big"
            handleInputChange={handleInputChange}
            options={
              selectedItem.itemTypeId === 1
                ? getShoesSizes()
                : getClothesSizes()
            }
            handleSelectChange={handleSizeChange}
            selectedValue={selectedItemAdditionalData.sizes.map((name) => ({
              name,
            }))}
          />
        ) : (
          <></>
        )}
        {selectedItem.itemTypeId === 2 || selectedItem.itemTypeId === 1 ? (
          <>
            {selectedItemAdditionalData.sizes
              .map((name) => ({
                name,
              }))
              .map((size, index) => (
                <FormField
                  fieldType={index % 6 === 0 ? "xsmall-start" : "xsmall"}
                  name={size.name}
                  text={size.name}
                  type="number"
                  key={index}
                  handleInputChange={handleInputChangeForAvailabilities}
                  value={
                    selectedItemAdditionalData.itemAvailabilities.filter(
                      (ia) => ia.itemSize === size.name
                    )[0].numberOfItemsLeft as unknown as string
                  }
                />
              ))}
          </>
        ) : (
          <FormField
            text="Number of items available"
            type="number"
            name="itemAvailability"
            fieldType="big"
            handleInputChange={handleInputChangeForAvailabilities}
            value={
              selectedItemAdditionalData.itemAvailabilities[0]
                .numberOfItemsLeft as unknown as string
            }
          />
        )}
      </div>
      <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end">
        <Button type="submit" text="Save product" />
      </div>
    </form>
  );
};

export default EditItem;
