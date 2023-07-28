import Item from "../../../models/Item";
import ProductsTableRow from "../../molecules/ProductsTableRows/ProductsTableRows";

interface ProductsTableProps {
  items: Item[];
}

const ProductsTable = ({ items }: ProductsTableProps) => {
  return (
    <table className="mt-1 col-start-2 col-span-4">
      <thead className="bg-gray-50 border-b-4 border-gray-200">
        <tr>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            No.
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Name
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Description
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Edit
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <ProductsTableRow item={item} index={index} />
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
