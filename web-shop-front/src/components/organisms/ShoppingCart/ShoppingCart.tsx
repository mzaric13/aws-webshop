import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import ShoppingCartFooter from "../../molecules/ShoppingCartFooter/ShoppingCartFooter";
import ShoppingCartHeader from "../../molecules/ShoppingCartHeader/ShoppingCartHeader";
import ShoppingCartItems from "../../molecules/ShoppingCartItems/ShoppingCartItems";

interface ShoppingCartProps {
  open: boolean;
}

const ShoppingCart = ({ open }: ShoppingCartProps) => {
  const { closeCart } = useShoppingCart();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <ShoppingCartHeader />
                      <ShoppingCartItems />
                    </div>
                    <ShoppingCartFooter />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ShoppingCart;
