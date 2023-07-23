import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import CategoryValues from "../../../models/CategoryValues";
import ItemType from "../../../models/ItemType";
import MobileMenuHeader from "../../molecules/MobileMenuHeader/MobileMenuHeader";
import Sidebar from "../Sidebar/Sidebar";

interface SidebarMobileProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
  itemTypes: ItemType[];
  categories: CategoryValues[];
  handleItemTypeClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SidebarMobile = ({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  itemTypes,
  categories,
  handleItemTypeClick,
}: SidebarMobileProps) => {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <MobileMenuHeader setMobileFiltersOpen={setMobileFiltersOpen} />
              <Sidebar
                categories={categories}
                itemTypes={itemTypes}
                itemTypesHandler={handleItemTypeClick}
                mobile={true}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SidebarMobile;
