import ItemAvailability from "../../../models/ItemAvailability";
import SizeField from "../../atoms/SizeField/SizeField";

interface SizeFieldsProps {
  sizes: string[];
  itemAvailabilities: ItemAvailability[];
  chosenSize: string;
  handleSizeClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SizeFields = ({
  sizes,
  itemAvailabilities,
  chosenSize,
  handleSizeClick,
}: SizeFieldsProps) => {
  const countActive = (size: string): boolean => {
    const itemAvailability = itemAvailabilities.filter(
      (ia) => ia.itemSize === size
    )[0];
    if (itemAvailability.numberOfItemsLeft > 0) return true;
    return false;
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
      </div>
      <fieldset className="mt-4">
        <legend className="sr-only">Choose a size</legend>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
          {sizes.map((size, index) => (
            <SizeField
              key={index}
              value={size}
              label={`size-choice-${index}-label`}
              active={countActive(size)}
              checked={size === chosenSize ? true : false}
              handleSizeClick={handleSizeClick}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default SizeFields;
