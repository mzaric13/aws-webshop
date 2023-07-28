import { useRef } from "react";
import NavbarLinks from "../../../models/NavbarLinks";
import NavButtons from "../../molecules/NavButtons/NavButtons";
import "./Navbar.css";

interface NavbarProps {
  navbarLinks: NavbarLinks[];
}

const Navbar = ({ navbarLinks }: NavbarProps) => {
  const navRef = useRef<HTMLDivElement>();

  const showNavbar = () => {
    if (navRef.current) {
      navRef.current.classList.toggle("responsive_nav");
    }
  };

  return (
    <header className="font-sans flex items-center justify-between h-20 py-0 px-8 bg-[#232f3e] text-[#eee]">
      <h3 className="font-sans">Sport equipment shop</h3>
      <NavButtons navRef={navRef} showNavbar={showNavbar} links={navbarLinks} />
    </header>
  );
};

export default Navbar;
