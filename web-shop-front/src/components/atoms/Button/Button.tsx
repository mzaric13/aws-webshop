interface ButtonProps {
  type: "submit" | "button" | "reset" | undefined;
}

const Button = ({ type }: ButtonProps) => {
  const getClassNames = () => {
    if (type === "submit")
      return "col-span-3 lg:w-60 sm:w-40 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else return "";
  };

  return (
    <button type={type} className={getClassNames()}>
      Register
    </button>
  );
};

export default Button;
