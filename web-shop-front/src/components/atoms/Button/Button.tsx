interface ButtonProps {
  type: "submit" | "button" | "reset" | "add" | undefined;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
}

const Button = ({ type, handleClick, text }: ButtonProps) => {
  const getClassNames = () => {
    if (type === "submit")
      return "col-span-3 lg:w-60 sm:w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else return "";
  };

  if (type === "add") {
    return (
      <button
        className="bg-green-500 hover:bg-green-900 rounded text-white h-10 w-full"
        onClick={handleClick}
      >
        {text}
      </button>
    );
  } else {
    return (
      <button type={type} className={getClassNames()}>
        Register
      </button>
    );
  }
};

export default Button;
