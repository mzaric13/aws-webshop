import Brand from "../../../models/Brand";
import ItemType from "../../../models/ItemType";
import Tag from "../../../models/Tag";
import { getClothesSizes, getShoesSizes } from "../../../utils/Util";
import FormField from "../../molecules/FormField/FormField";

interface AddItemBasicProps {
  brands: Brand[];
  itemTypes: ItemType[];
  tags: Tag[];
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
  selectedItemType: ItemType;
  selectedBrand: Brand;
  selectedTags: Tag[];
  selectedSizes: any[];
  handleItemTypeChange: (it: ItemType) => void;
  handleBrandChange: (b: Brand) => void;
  handleTagsChange: (tags: Tag[]) => void;
  handleSizeChange: (size: any) => void;
}

const AddItemBasic = ({
  brands,
  itemTypes,
  tags,
  handleInputChange,
  selectedItemType,
  selectedBrand,
  selectedTags,
  selectedSizes,
  handleItemTypeChange,
  handleBrandChange,
  handleTagsChange,
  handleSizeChange,
}: AddItemBasicProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <FormField
        text="Name"
        name="name"
        type="text"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Item type"
        name="itemType"
        type="select"
        fieldType="medium"
        handleInputChange={handleInputChange}
        options={itemTypes}
        handleSelectChange={handleItemTypeChange}
        selectedValue={selectedItemType}
      />
      <FormField
        text="Description"
        type="text"
        name="description"
        fieldType="big"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Brand"
        name="brand"
        type="select"
        fieldType="medium"
        handleInputChange={handleInputChange}
        options={brands}
        handleSelectChange={handleBrandChange}
        selectedValue={selectedBrand}
      />
      {selectedItemType.name === "CLOTHES" ? (
        <FormField
          text="Sizes"
          name="sizes"
          type="multi"
          fieldType="medium"
          handleInputChange={handleInputChange}
          options={getClothesSizes()}
          handleSelectChange={handleSizeChange}
          selectedValue={selectedSizes}
        />
      ) : (
        <>
          {selectedItemType.name === "SHOES" ? (
            <FormField
              text="Sizes"
              name="sizes"
              type="multi"
              fieldType="medium"
              handleInputChange={handleInputChange}
              options={getShoesSizes()}
              handleSelectChange={handleSizeChange}
              selectedValue={selectedSizes}
            />
          ) : (
            <></>
          )}
        </>
      )}
      <FormField
        text="Tags"
        type="multi"
        name="tags"
        fieldType="big"
        handleInputChange={handleInputChange}
        options={tags}
        handleSelectChange={handleTagsChange}
        selectedValue={selectedTags}
      />
    </div>
  );
};

export default AddItemBasic;
