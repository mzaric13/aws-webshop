import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationElementProps {
  number: string;
  current: boolean;
  onClick: (page: string) => void;
}

const PaginationElement = ({
  number,
  current,
  onClick,
}: PaginationElementProps) => {
  const getClasses = () => {
    if (current)
      return "z-10 bg-[#232f3e] hover:text-[#f90] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#232f3e]";
    else
      return "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0";
  };

  if (number === "Previous")
    return (
      <button
        onClick={() => onClick(number)}
        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <GrPrevious className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  else if (number === "Next")
    return (
      <button
        onClick={() => onClick(number)}
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <GrNext className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  else
    return (
      <button
        onClick={() => onClick(number)}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${getClasses()}`}
      >
        {number}
      </button>
    );
};

export default PaginationElement;
