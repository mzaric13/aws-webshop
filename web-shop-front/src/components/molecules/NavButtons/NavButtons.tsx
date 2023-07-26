import React from "react";
import { Link } from "react-router-dom";
import NavbarButton from "../../atoms/NavbarButton/NavbarButton";
import "./NavButtons.css";

interface NavButtonsProps {
  navRef: any;
  showNavbar: () => void;
}

const NavButtons = ({ navRef, showNavbar }: NavButtonsProps) => {
  return (
    <React.Fragment>
      <nav ref={navRef}>
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="sign-in">
          Sign In
        </Link>
        <Link className="link" to="sing-up">
          Create account
        </Link>
        <NavbarButton isTimes={true} showNavbar={showNavbar} />
      </nav>
      <NavbarButton isTimes={false} showNavbar={showNavbar} />
    </React.Fragment>
  );
};

export default NavButtons;
