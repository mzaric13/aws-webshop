import moment from "moment";
import { PriceList } from "../../../models/PriceList";
import ProductTableField from "../../atoms/ProductTableField/ProductTableField";

interface PriceListsTableRowProps {
  priceList: PriceList;
  index: number;
  onClick: (priceListId: number) => void;
}

const PriceListsTableRow = ({
  priceList,
  index,
  onClick,
}: PriceListsTableRowProps) => {
  const getClassNames = () => {
    if (index % 2 !== 0) return "bg-white";
    else return "bg-gray-50";
  };

  return (
    <tr className={getClassNames()}>
      <ProductTableField
        data={priceList.id}
        type="data"
        itemId={priceList.id}
        onClick={onClick}
      />
      <ProductTableField
        data={priceList.valid === true ? "VALID" : "INVALID"}
        type="data"
        itemId={priceList.id}
        onClick={onClick}
      />
      <ProductTableField
        data={moment(priceList.validFrom).format("DD.MM.YYYY")}
        type="data"
        itemId={priceList.id}
        onClick={onClick}
      />
      <ProductTableField
        data={moment(priceList.validTo).format("DD.MM.YYYY")}
        type="data"
        itemId={priceList.id}
        onClick={onClick}
      />
      {priceList.valid ? (
        <ProductTableField
          data="Edit"
          type="edit"
          itemId={priceList.id}
          onClick={onClick}
        />
      ) : (
        <></>
      )}
    </tr>
  );
};

export default PriceListsTableRow;
