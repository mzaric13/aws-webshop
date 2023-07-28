import React from "react";
import { Link } from "react-router-dom";
import NavbarLinks from "../../../models/NavbarLinks";
import NavbarButton from "../../atoms/NavbarButton/NavbarButton";
import "./NavButtons.css";

interface NavButtonsProps {
  navRef: any;
  showNavbar: () => void;
  links: NavbarLinks[];
}

const NavButtons = ({ navRef, showNavbar, links }: NavButtonsProps) => {
  return (
    <React.Fragment>
      <nav className="link" ref={navRef}>
        {links.map((link, index) => (
          <Link key={index} className="link" to={link.linkTo}>
            {link.text}
          </Link>
        ))}
        <NavbarButton isTimes={true} showNavbar={showNavbar} />
      </nav>
      <NavbarButton isTimes={false} showNavbar={showNavbar} />
    </React.Fragment>
  );
};

export default NavButtons;
