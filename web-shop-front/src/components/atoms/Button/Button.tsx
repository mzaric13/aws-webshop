import { FaTimes } from "react-icons/fa";

interface ButtonProps {
  type: "submit" | "button" | "reset" | "add" | "back" | "close" | undefined;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
}

const Button = ({ type, handleClick, text }: ButtonProps) => {
  const getClassNames = () => {
    if (type === "submit")
      return "col-span-3 lg:w-60 sm:w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else if (type === "add")
      return "bg-green-500 hover:bg-green-900 rounded text-white h-10 w-full";
    else if (type === "button")
      return "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else if (type === "back")
      return "text-sm font-semibold leading-6 text-gray-900";
    else return "";
  };

  if (type === "add" || type === "button" || type === "back") {
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
  } else {
    return (
      <button type={type} className={getClassNames()}>
        {text}
      </button>
    );
  }
};

export default Button;
