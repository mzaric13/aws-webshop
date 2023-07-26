import React from "react";
import CategoryValues, { ValueC } from "../../../models/CategoryValues";

interface SidebarFilterInputProps {
  section: CategoryValues;
  option: ValueC;
  optionIdx: number;
  mobile: boolean;
  handler: (event: React.MouseEvent<HTMLElement>) => void;
}

const SidebarFilterInput = ({
  section,
  option,
  optionIdx,
  mobile,
  handler,
}: SidebarFilterInputProps) => {
  const getClassNames = () => {
    if (mobile) return "ml-3 min-w-0 flex-1 text-gray-500";
    else return "ml-3 text-sm text-gray-600";
  };

  return (
    <React.Fragment>
      <input
        id={`filter-${section.category}-${optionIdx}`}
        name={`${section.category}[]`}
        defaultValue={option.name}
        type="checkbox"
        title={option.name}
        defaultChecked={option.checked}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        onClick={handler}
      />
      <label
        htmlFor={`filter-${section.category}-${optionIdx}`}
        className={getClassNames()}
      >
        {option.name}
      </label>
    </React.Fragment>
  );
};

export default SidebarFilterInput;
