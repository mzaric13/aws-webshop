interface InputProps {
  type: string;
  name: string;
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Input = ({ type, name, handleInputChange, value }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      onChange={handleInputChange}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={value}
    />
  );
};

export default Input;
