interface LabelProps {
  name: string;
  text: string;
}

const Label = ({ name, text }: LabelProps) => {
  return (
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {text}
    </label>
  );
};

export default Label;
