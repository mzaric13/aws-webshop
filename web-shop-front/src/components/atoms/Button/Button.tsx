import { FaTimes } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { HiMinus, HiPlus } from "react-icons/hi";

interface ButtonProps {
  type:
    | "submit"
    | "button"
    | "reset"
    | "add"
    | "back"
    | "close"
    | "next"
    | "previous"
    | "plus"
    | "minus"
    | "add-cart"
    | undefined;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  leftRightHandler?: () => void;
  text?: string;
  login?: boolean;
}

const Button = ({
  type,
  handleClick,
  text,
  leftRightHandler,
  login,
}: ButtonProps) => {
  const getClassNames = () => {
    if (type === "submit" && login)
      return "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else if (type === "submit")
      return "col-span-3 lg:w-60 sm:w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else if (type === "add")
      return "bg-green-500 hover:bg-green-900 rounded text-white h-10 w-full";
    else if (type === "button")
      return "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else if (type === "back")
      return "text-sm font-semibold leading-6 text-gray-900";
    else if (type === "add-cart")
      return "bg-[#232f3e] text-white font-semibold py-3 px-16 sm:w-2/4 rounded-xl h-full hover:text-[#f90] mb-36";
    else return "";
  };

  if (
    type === "add" ||
    type === "button" ||
    type === "back" ||
    type === "add-cart"
  ) {
    return (
      <button type="button" className={getClassNames()} onClick={handleClick}>
        {text}
      </button>
    );
  } else if (type === "close") {
    return (
      <button
        type="button"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        data-modal-hide="medium-modal"
        onClick={handleClick}
      >
        <FaTimes className="border-none opacity-100 outline-none bg-transparent" />
      </button>
    );
  } else if (type === "next" || type === "previous") {
    return (
      <button
        onClick={leftRightHandler}
        className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
      >
        {type === "previous" ? <GrPrevious size={40} /> : <GrNext size={40} />}
      </button>
    );
  } else if (type === "plus" || type === "minus") {
    return (
      <button
        className="bg-gray-200 py-2 px-5 rounded-lg text-[#232f3e] "
        onClick={leftRightHandler}
      >
        {type === "minus" ? <HiMinus /> : <HiPlus />}
      </button>
    );
  } else {
    return (
      <button type={type} className={getClassNames()}>
        {text}
      </button>
    );
  }
};

export default Button;
