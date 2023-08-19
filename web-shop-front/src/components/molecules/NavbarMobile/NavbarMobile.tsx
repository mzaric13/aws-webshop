import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarLinks from "../../../models/NavbarLinks";
import { logout } from "../../../services/auth-service";
import { getToken } from "../../../services/token-service";
import NavbarButton from "../../atoms/NavbarButton/NavbarButton";
import NavButtons from "../NavButtons/NavButtons";

interface NavbarMobileProps {
  mobileMenuOpen: boolean;
  navbarLinks: NavbarLinks[];
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarMobile = ({
  mobileMenuOpen,
  navbarLinks,
  setMobileMenuOpen,
}: NavbarMobileProps) => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = getToken();
    if (!token || token === "undefined") return false;
    return true;
  };

  return (
    <Dialog
      as="div"
      className="lg:hidden"
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
    >
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#232f3e] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <h1 className="-m-1.5 p-1.5 font-bold uppercase text-white">
            Sports equipment shop
          </h1>
          <NavbarButton isTimes={true} setMobileMenuOpen={setMobileMenuOpen} />
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y-2 divide-[#eee]">
            <div className="space-y-2 py-6">
              <NavButtons mobile={true} links={navbarLinks} />
            </div>
            <div className="py-6">
              {isLoggedIn() ? (
                <span
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#eee] hover:bg-[#f90] cursor-pointer"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </span>
              ) : (
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#eee] hover:bg-[#f90]"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default NavbarMobile;
