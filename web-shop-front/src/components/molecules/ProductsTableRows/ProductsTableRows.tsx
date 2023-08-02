import Item from "../../../models/Item";
import ProductTableField from "../../atoms/ProductTableField/ProductTableField";

interface ProductsTableRowProps {
  index: number;
  item: Item;
  onClick: (itemId: number) => void;
}

const ProductsTableRow = ({ index, item, onClick }: ProductsTableRowProps) => {
  const getClassNames = () => {
    if (index % 2 !== 0) return "bg-white";
    else return "bg-gray-50";
  };

  return (
    <tr className={getClassNames()}>
      <ProductTableField
        data={item.id}
        type="data"
        itemId={item.id}
        onClick={onClick}
      />
      <ProductTableField
        data={item.name}
        type="data"
        itemId={item.id}
        onClick={onClick}
      />
      <ProductTableField
        data={item.description}
        type="data"
        itemId={item.id}
        onClick={onClick}
      />
      <ProductTableField
        data="Edit"
        type="click"
        itemId={item.id}
        onClick={onClick}
      />
    </tr>
  );
};

export default ProductsTableRow;
