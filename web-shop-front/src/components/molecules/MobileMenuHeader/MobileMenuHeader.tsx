import { Dispatch, SetStateAction } from "react";
import CloseMobileMenuButton from "../../atoms/CloseMobileMenuButton/CloseMobileMenuButton";

interface MobileMenuHeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileMenuHeader = ({ setMobileFiltersOpen }: MobileMenuHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4">
      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
      <CloseMobileMenuButton setMobileFiltersOpen={setMobileFiltersOpen} />
    </div>
  );
};

export default MobileMenuHeader;
