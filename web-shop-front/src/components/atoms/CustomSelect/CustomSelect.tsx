import Select from "react-select";

interface CustomSelectProps {
  isMulti: boolean;
  name: string;
  selectOptions?: any[];
  onChange: (i: any) => void;
  selectedValue: any;
}

const CustomSelect = ({
  isMulti,
  name,
  selectOptions,
  onChange,
  selectedValue,
}: CustomSelectProps) => {
  return (
    <Select
      isMulti={isMulti}
      options={selectOptions}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
      name={name}
      onChange={onChange}
      value={selectedValue}
    />
  );
};

export default CustomSelect;
