import { FaBars, FaTimes } from "react-icons/fa";
import "./NavbarButton.css";

interface NavbarButtonProps {
  isTimes: boolean;
  showNavbar: () => void;
}

const NavbarButton = ({ isTimes, showNavbar }: NavbarButtonProps) => {
  if (isTimes) {
    return (
      <button className="nav-btn nav-close-btn" onClick={showNavbar}>
        <FaTimes />
      </button>
    );
  } else {
    return (
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    );
  }
};

export default NavbarButton;
