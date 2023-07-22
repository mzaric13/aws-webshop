import SidebarInput from "../../atoms/Input/SidebarInput";
import "./SidebarCategories.css";

interface SidebarCategoriesProps {
  values: string[];
  categoryHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categoryName: string;
}

const SidebarCategories = ({
  values,
  categoryHandler,
  categoryName,
}: SidebarCategoriesProps) => {
  return (
    <div>
      <h2 className="sidebar-title">{categoryName}</h2>
      <div>
        {values.map((value, index) => (
          <SidebarInput
            key={index}
            handleChange={categoryHandler}
            value={value}
            title={value}
            name={categoryName}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarCategories;
