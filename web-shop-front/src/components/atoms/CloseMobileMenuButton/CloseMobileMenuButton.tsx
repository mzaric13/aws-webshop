import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";

interface CloseMobileMenuButtonProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

const CloseMobileMenuButton = ({
  setMobileFiltersOpen,
}: CloseMobileMenuButtonProps) => {
  return (
    <button
      type="button"
      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
      onClick={() => setMobileFiltersOpen(false)}
    >
      <span className="sr-only">Close menu</span>
      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

export default CloseMobileMenuButton;
