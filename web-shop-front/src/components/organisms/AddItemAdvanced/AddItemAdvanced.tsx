import ItemType from "../../../models/ItemType";
import FormField from "../../molecules/FormField/FormField";

interface AddItemAdvancedProps {
  selectedItemType: ItemType;
  sizes: any[];
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
  handleSizeInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddItemAdvanced = ({
  selectedItemType,
  sizes,
  handleInputChange,
  handleSizeInputChange,
}: AddItemAdvancedProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      {selectedItemType.name === "CLOTHES" ||
      selectedItemType.name === "SHOES" ? (
        <>
          {sizes.map((size, index) => (
            <FormField
              fieldType={index % 6 === 0 ? "xsmall-start" : "xsmall"}
              name={size.name}
              text={size.name}
              type="number"
              key={index}
              handleInputChange={handleSizeInputChange}
            />
          ))}
        </>
      ) : (
        <FormField
          text="Number of items available"
          type="number"
          name="itemAvailability"
          fieldType="medium"
          handleInputChange={handleSizeInputChange}
        />
      )}
      <FormField
        text="Price"
        type="number"
        name="price"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default AddItemAdvanced;
