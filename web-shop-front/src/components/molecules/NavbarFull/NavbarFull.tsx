import { Popover } from "@headlessui/react";
import React, { Dispatch, SetStateAction } from "react";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NavbarLinks from "../../../models/NavbarLinks";
import { logout } from "../../../services/auth-service";
import { getRole, getToken } from "../../../services/token-service";
import NavbarButton from "../../atoms/NavbarButton/NavbarButton";
import NavbarCartButton from "../../atoms/NavbarCartButton/NavbarCartButton";
import NavButtons from "../NavButtons/NavButtons";

interface NavbarFullProps {
  navbarLinks: NavbarLinks[];
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarFull = ({ navbarLinks, setMobileMenuOpen }: NavbarFullProps) => {
  const navigate = useNavigate();

  const checkRole = () => {
    const role = getRole();
    if (!role || role === "undefined" || role === "USER") return true;
    else return false;
  };

  const isLoggedIn = () => {
    const token = getToken();
    if (!token || token === "undefined") return false;
    return true;
  };

  return (
    <React.Fragment>
      <div className="flex lg:hidden">
        {checkRole() ? <NavbarCartButton /> : <></>}
        <NavbarButton isTimes={false} setMobileMenuOpen={setMobileMenuOpen} />
      </div>
      <Popover.Group className="hidden lg:flex lg:gap-x-12">
        <NavButtons mobile={false} links={navbarLinks} />
      </Popover.Group>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
        {checkRole() ? <NavbarCartButton /> : <></>}
        {isLoggedIn() ? (
          <FiLogOut
            className="m-2 text-white cursor-pointer"
            size={30}
            onClick={() => {
              logout();
              navigate("/");
            }}
          />
        ) : (
          <FiLogIn
            className="m-2 text-white cursor-pointer"
            size={30}
            onClick={() => {
              navigate("/login");
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default NavbarFull;
