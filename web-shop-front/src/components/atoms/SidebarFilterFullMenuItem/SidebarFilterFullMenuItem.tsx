import { Menu } from "@headlessui/react";
import SortOption from "../../../models/SortOption";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarFilterFullMenuItemProps {
  option: SortOption;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SidebarFilterFullMenuItem = ({
  option,
  handleClick,
}: SidebarFilterFullMenuItemProps) => {
  return (
    <Menu.Item key={option.name}>
      {({ active }) => (
        <span
          id={option.name}
          onClick={handleClick}
          className={classNames(
            option.current ? "font-medium text-gray-900" : "text-gray-500",
            option.current ? "bg-gray-100" : "",
            "block px-4 py-2 text-sm cursor-pointer"
          )}
        >
          {option.name}
        </span>
      )}
    </Menu.Item>
  );
};

export default SidebarFilterFullMenuItem;
