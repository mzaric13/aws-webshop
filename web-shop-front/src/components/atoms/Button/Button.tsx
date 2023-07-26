interface ButtonProps {
  type: "submit" | "button" | "reset" | undefined;
}

const Button = ({ type }: ButtonProps) => {
  const getClassNames = () => {
    if (type === "submit")
      return "col-start-2 col-span-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
    else return "";
  };

  return (
    <button type={type} className={getClassNames()}>
      Register
    </button>
  );
};

export default Button;
