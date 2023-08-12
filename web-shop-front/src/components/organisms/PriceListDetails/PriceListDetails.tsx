import moment from "moment";
import { PriceList, PriceListCreation } from "../../../models/PriceList";
import Button from "../../atoms/Button/Button";
import FormField from "../../molecules/FormField/FormField";

interface PriceListDetailsProps {
  isAdd: boolean;
  priceList: PriceList | PriceListCreation;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceListDetails = ({
  isAdd,
  priceList,
  handleInputChange,
}: PriceListDetailsProps) => {
  return (
    <form>
      <div className="p-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <FormField
          text="Valid to"
          type="date"
          name="validTo"
          fieldType="big"
          handleInputChange={handleInputChange}
          value={
            isAdd ? undefined : moment(priceList.validTo).format("YYYY-MM-DD")
          }
        />
        <h5 className="font-bold col-span-6 mt-4 mb-4">Products prices</h5>
        {priceList.priceListItems.map((priceListItem, index) => (
          <FormField
            key={index}
            text={priceListItem.itemName}
            type="number"
            name={priceListItem.itemName}
            fieldType="medium"
            handleInputChange={handleInputChange}
            value={priceListItem.price as unknown as string}
          />
        ))}
      </div>
      <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end">
        <Button
          type="submit"
          text={isAdd ? "Create price list" : "Save price list"}
        />
      </div>
    </form>
  );
};

export default PriceListDetails;
