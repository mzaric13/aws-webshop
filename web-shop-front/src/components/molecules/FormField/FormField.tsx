import Input from "../../atoms/Input/Input";
import Label from "../../atoms/Label/Label";

interface FormFieldProps {
  name: string;
  type: string;
  text: string;
  fieldType: string;
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({
  name,
  type,
  text,
  fieldType,
  handleInputChange,
}: FormFieldProps) => {
  const getColumns = () => {
    if (fieldType === "small") return "sm:col-span-2";
    else if (fieldType === "small-start") return "sm:col-span-2 sm:col-start-1";
    else if (fieldType === "medium") return "sm:col-span-3";
    else if (fieldType === "big") return "sm:col-span-6";
    else if (fieldType === "full") return "col-span-full";
    else return "";
  };

  return (
    <div className={getColumns()}>
      <Label name={name} text={text} />
      <div className="mt-2">
        <Input type={type} name={name} handleInputChange={handleInputChange} />
      </div>
    </div>
  );
};

export default FormField;
