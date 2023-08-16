import { PriceList } from "../../../models/PriceList";
import PriceListsTableRow from "../../molecules/PriceListsTableRow/PriceListsTableRow";

interface PriceListTableProps {
  priceLists: PriceList[];
  handleEditClick: (priceListId: number) => void;
}

const PriceListsTable = ({
  priceLists,
  handleEditClick,
}: PriceListTableProps) => {
  return (
    <table className="mt-1 col-start-2 col-span-4 table-fixed rounded-xl">
      <thead className="bg-gray-50 border-b-4 border-gray-200">
        <tr>
          <th className="p-3 text-sm font-semibold tracking-wide text-left w-20">
            Price list id
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Valid
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Valid from
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Valid to
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
        </tr>
      </thead>
      <tbody>
        {priceLists.map((priceList, index) => (
          <PriceListsTableRow
            priceList={priceList}
            index={index}
            onClick={handleEditClick}
            key={index}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PriceListsTable;
