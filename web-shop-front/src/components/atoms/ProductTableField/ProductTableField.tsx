import { OrderStatus } from "../../../models/Order";
import CustomSelect from "../CustomSelect/CustomSelect";

interface ProductTableFieldProps {
  type: string;
  data: any;
  itemId: number;
  selected?: OrderStatus;
  selectOptions?: OrderStatus[];
  onSelect?: (orderStatus: OrderStatus, orderId: number) => void;
  onClick: (itemId: number) => void;
}

const ProductTableField = ({
  type,
  data,
  itemId,
  selected,
  selectOptions,
  onSelect,
  onClick,
}: ProductTableFieldProps) => {
  if (type === "data")
    return (
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        <p className="line-clamp-6 whitespace-pre-line">{data}</p>
      </td>
    );
  else if (type === "select")
    return (
      <td className="p-3 whitespace-nowrap">
        <CustomSelect
          isMulti={false}
          name="status"
          selectedValue={selected}
          onChange={
            onSelect ? (orderStatus) => onSelect(orderStatus, itemId) : () => {}
          }
          selectOptions={selectOptions}
        />
      </td>
    );
  else if (type === "button")
    return (
      <td>
        <button
          className="text-green-500 hover:text-green-700"
          onClick={() => onClick(itemId)}
        >
          {data}
        </button>
      </td>
    );
  else
    return (
      <td className="p-3 whitespace-nowrap">
        <span
          className="cursor-pointer hover:underline font-bold text-[#f90]"
          onClick={() => onClick(itemId)}
        >
          {data}
        </span>
      </td>
    );
};

export default ProductTableField;
