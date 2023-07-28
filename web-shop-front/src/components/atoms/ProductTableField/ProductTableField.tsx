interface ProductTableFieldProps {
  type: string;
  data: any;
}

const ProductTableField = ({ type, data }: ProductTableFieldProps) => {
  if (type === "data")
    return (
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{data}</td>
    );
  else
    return (
      <span className="cursor-pointer hover:underline font-bold text-[#f90]">
        {data}
      </span>
    );
};

export default ProductTableField;
