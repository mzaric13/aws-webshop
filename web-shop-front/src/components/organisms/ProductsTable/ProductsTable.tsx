import Item from "../../../models/Item";
import ProductsTableRow from "../../molecules/ProductsTableRows/ProductsTableRows";

interface ProductsTableProps {
  items: Item[];
  onClick: (itemId: number) => void;
}

const ProductsTable = ({ items, onClick }: ProductsTableProps) => {
  return (
    <table className="mt-1 col-start-2 col-span-4 table-fixed">
      <thead className="bg-gray-50 border-b-4 border-gray-200">
        <tr>
          <th className="p-3 text-sm font-semibold tracking-wide text-left sm:w-20 w-10">
            No.
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left sm:w-40 w-20">
            Name
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Description
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left sm:w-20 w-10">
            Edit
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <ProductsTableRow
            key={index}
            item={item}
            index={index}
            onClick={onClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
