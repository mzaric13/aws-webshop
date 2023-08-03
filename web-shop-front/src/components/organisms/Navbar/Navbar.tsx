import { useState } from "react";
import NavbarLinks from "../../../models/NavbarLinks";
import NavbarFull from "../../molecules/NavbarFull/NavbarFull";
import NavbarMobile from "../../molecules/NavbarMobile/NavbarMobile";

interface NavbarProps {
  navbarLinks: NavbarLinks[];
}

const Navbar = ({ navbarLinks }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#232f3e]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <h1 className="font-bold uppercase text-white">
            Sports equipment shop
          </h1>
        </div>
        <NavbarFull
          navbarLinks={navbarLinks}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </nav>
      <NavbarMobile
        mobileMenuOpen={mobileMenuOpen}
        navbarLinks={navbarLinks}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </header>
  );
};

export default Navbar;
