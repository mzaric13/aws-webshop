import { Dispatch, SetStateAction } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarButtonProps {
  isTimes: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarButton = ({ isTimes, setMobileMenuOpen }: NavbarButtonProps) => {
  if (isTimes) {
    return (
      <button
        type="button"
        className="-m-2.5 rounded-md p-2.5 text-gray-700"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FaTimes className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    );
  } else {
    return (
      <button
        type="button"
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        onClick={() => setMobileMenuOpen(true)}
      >
        <FaBars className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    );
  }
};

export default NavbarButton;
