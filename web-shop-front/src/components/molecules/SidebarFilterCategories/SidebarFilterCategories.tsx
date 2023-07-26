import React from "react";
import ItemType from "../../../models/ItemType";
import SidebarFilterCategory from "../../atoms/SidebarFilterCategory/SidebarFilterCategory";

interface SidebarFilterCategoriesProps {
  itemTypes: ItemType[];
  handler: (event: React.MouseEvent<HTMLElement>) => void;
  mobile: boolean;
}

const SidebarFilterCategories = ({
  itemTypes,
  handler,
  mobile,
}: SidebarFilterCategoriesProps) => {
  const getClassNames = () => {
    if (mobile) return "px-2 py-3 font-medium text-gray-900";
    else
      return "space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900";
  };

  return (
    <React.Fragment>
      <h3 className="sr-only">Categories</h3>
      <ul className={getClassNames()}>
        {itemTypes.map((itemType, index) => (
          <SidebarFilterCategory
            mobile={mobile}
            key={index}
            itemType={itemType}
            handleClick={handler}
          />
        ))}
      </ul>
    </React.Fragment>
  );
};

export default SidebarFilterCategories;
