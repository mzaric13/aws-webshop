import CustomSelect from "../../atoms/CustomSelect/CustomSelect";
import Input from "../../atoms/Input/Input";
import Label from "../../atoms/Label/Label";

interface FormFieldProps {
  name: string;
  type: string;
  text: string;
  fieldType: string;
  value?: string;
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
  options?: any[];
  handleSelectChange?: (it: any) => void;
  selectedValue?: any;
}

const FormField = ({
  name,
  type,
  text,
  fieldType,
  value,
  handleInputChange,
  options,
  handleSelectChange,
  selectedValue,
}: FormFieldProps) => {
  const getColumns = () => {
    if (fieldType === "xsmall") return "sm:col-span-1";
    else if (fieldType === "xsmall-start")
      return "sm:col-span-1 sm:col-start-1";
    else if (fieldType === "small") return "sm:col-span-2";
    else if (fieldType === "small-start") return "sm:col-span-2 sm:col-start-1";
    else if (fieldType === "medium") return "sm:col-span-3";
    else if (fieldType === "big") return "sm:col-span-6";
    else if (fieldType === "full") return "col-span-full";
    else return "";
  };

  if (type === "select" && handleSelectChange) {
    return (
      <div className={getColumns()}>
        <Label name={name} text={text} />
        <div className="mt-2">
          <CustomSelect
            name={name}
            isMulti={false}
            selectOptions={options}
            onChange={handleSelectChange}
            selectedValue={selectedValue}
          />
        </div>
      </div>
    );
  } else if (type === "multi" && handleSelectChange) {
    return (
      <div className={getColumns()}>
        <Label name={name} text={text} />
        <div className="mt-2">
          <CustomSelect
            name={name}
            isMulti={true}
            selectOptions={options}
            onChange={handleSelectChange}
            selectedValue={selectedValue}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className={getColumns()}>
        <Label name={name} text={text} />
        <div className="mt-2">
          <Input
            type={type}
            name={name}
            handleInputChange={handleInputChange}
            value={value}
          />
        </div>
      </div>
    );
  }
};

export default FormField;
