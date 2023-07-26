import { useRef } from "react";
import NavButtons from "../../molecules/NavButtons/NavButtons";
import "./Navbar.css";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>();

  const showNavbar = () => {
    if (navRef.current) {
      navRef.current.classList.toggle("responsive_nav");
    }
  };

  return (
    <header>
      <h3>Sport equipment shop</h3>
      <NavButtons navRef={navRef} showNavbar={showNavbar} />
    </header>
  );
};

export default Navbar;
