import ItemType from "../../../models/ItemType";

interface SidebarFilterCategoryProps {
  itemType: ItemType;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  mobile: boolean;
}

const SidebarFilterCategory = ({
  itemType,
  handleClick,
  mobile,
}: SidebarFilterCategoryProps) => {
  const getClassNames = () => {
    if (mobile) return "block px-2 py-3 cursor-pointer";
    else return "cursor-pointer";
  };

  return (
    <li
      id={itemType.name}
      key={itemType.name}
      onClick={handleClick}
      className={getClassNames()}
    >
      {itemType.name}
    </li>
  );
};

export default SidebarFilterCategory;
