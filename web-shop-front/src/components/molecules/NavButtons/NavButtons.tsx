import React from "react";
import { Link } from "react-router-dom";
import NavbarLinks from "../../../models/NavbarLinks";

interface NavButtonsProps {
  mobile: boolean;
  links: NavbarLinks[];
}

const NavButtons = ({ mobile, links }: NavButtonsProps) => {
  const getClassNames = () => {
    if (mobile)
      return "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#eee] hover:text-[#f90]";
    else return "text-sm font-semibold leading-6 text-[#eee] hover:text-[#f90]";
  };

  return (
    <React.Fragment>
      {links.map((link, index) => (
        <Link key={index} className={`${getClassNames()}`} to={link.linkTo}>
          {link.text}
        </Link>
      ))}
    </React.Fragment>
  );
};

export default NavButtons;
