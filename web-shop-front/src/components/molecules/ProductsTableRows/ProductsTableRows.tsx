import Item from "../../../models/Item";
import ProductTableField from "../../atoms/ProductTableField/ProductTableField";

interface ProductsTableRowProps {
  index: number;
  item: Item;
}

const ProductsTableRow = ({ index, item }: ProductsTableRowProps) => {
  const getClassNames = () => {
    if (index % 2 !== 0) return "bg-white";
    else return "bg-gray-50";
  };

  return (
    <tr className={getClassNames()}>
      <ProductTableField data={item.id} type="data" />
      <ProductTableField data={item.name} type="data" />
      <ProductTableField data={item.description} type="data" />
      <ProductTableField data="Edit" type="click" />
    </tr>
  );
};

export default ProductsTableRow;
