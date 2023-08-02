interface ProductTableFieldProps {
  type: string;
  data: any;
  itemId: number;
  onClick: (itemId: number) => void;
}

const ProductTableField = ({
  type,
  data,
  itemId,
  onClick,
}: ProductTableFieldProps) => {
  if (type === "data")
    return (
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        <p className="line-clamp-6 whitespace-pre-line">{data}</p>
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
