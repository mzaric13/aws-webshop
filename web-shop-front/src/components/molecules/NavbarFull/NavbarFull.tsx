import { Popover } from "@headlessui/react";
import React, { Dispatch, SetStateAction } from "react";
import { FiLogIn } from "react-icons/fi";
import NavbarLinks from "../../../models/NavbarLinks";
import NavbarButton from "../../atoms/NavbarButton/NavbarButton";
import NavbarCartButton from "../../atoms/NavbarCartButton/NavbarCartButton";
import NavButtons from "../NavButtons/NavButtons";

interface NavbarFullProps {
  navbarLinks: NavbarLinks[];
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarFull = ({ navbarLinks, setMobileMenuOpen }: NavbarFullProps) => {
  return (
    <React.Fragment>
      <div className="flex lg:hidden">
        <NavbarCartButton />
        <NavbarButton isTimes={false} setMobileMenuOpen={setMobileMenuOpen} />
      </div>
      <Popover.Group className="hidden lg:flex lg:gap-x-12">
        <NavButtons mobile={false} links={navbarLinks} />
      </Popover.Group>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
        <NavbarCartButton />
        <FiLogIn className="m-2 text-white cursor-pointer" size={30} />
      </div>
    </React.Fragment>
  );
};

export default NavbarFull;
