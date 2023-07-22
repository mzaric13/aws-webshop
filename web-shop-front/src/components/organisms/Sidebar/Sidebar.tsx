import React from "react";
import Brand from "../../../models/Brand";
import ItemType from "../../../models/ItemType";
import SidebarCategories from "../../molecules/SidebarCategories/SidebarCategories";

interface CatValue {
  category: string;
  values: string[];
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SidebarProps {
  selectedBrand: Brand | undefined;
  selectedItemType: ItemType | undefined;
  categories: CatValue[];
}

const Sidebar = ({
  categories,
  selectedBrand,
  selectedItemType,
}: SidebarProps) => {
  return (
    <section className="sidebar">
      <div className="logo-container">
        <h1>🛒</h1>
      </div>
      {categories &&
        categories.map((category, index) => (
          <SidebarCategories
            key={index}
            values={category.values}
            categoryHandler={category.handler}
            categoryName={category.category}
          />
        ))}
    </section>
  );
};

export default Sidebar;
