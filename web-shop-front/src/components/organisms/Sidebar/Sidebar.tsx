import React from "react";
import CategoryValues from "../../../models/CategoryValues";
import ItemType from "../../../models/ItemType";
import SidebarFilterCategories from "../../molecules/SidebarFilterCategories/SidebarFilterCategories";
import SidebarFilters from "../../molecules/SidebarFilters/SidebarFilters";
import SidebarMobileFilters from "../../molecules/SidebarMobileFilters.tsx/SidebarMobileFilters";

interface SidebarProps {
  itemTypes: ItemType[];
  itemTypesHandler: (event: React.MouseEvent<HTMLElement>) => void;
  categories: CategoryValues[];
  mobile: boolean;
  handlers: ((event: React.MouseEvent<HTMLElement>) => void)[];
}

const Sidebar = ({
  itemTypes,
  itemTypesHandler,
  categories,
  mobile,
  handlers,
}: SidebarProps) => {
  const getClassNames = () => {
    if (mobile) return "mt-4 border-t border-gray-200";
    else return "hidden lg:block";
  };

  return (
    <form className={getClassNames()}>
      <SidebarFilterCategories
        mobile={mobile}
        itemTypes={itemTypes}
        handler={itemTypesHandler}
      />

      {mobile ? (
        <SidebarMobileFilters filters={categories} handlers={handlers} />
      ) : (
        <SidebarFilters filters={categories} handlers={handlers} />
      )}
    </form>
  );
};

export default Sidebar;
