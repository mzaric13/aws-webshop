import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useShoppingCart } from "../../../context/ShoppingCartContext";

const ShoppingCartHeader = () => {
  const { closeCart } = useShoppingCart();

  return (
    <div className="flex items-start justify-between">
      <Dialog.Title className="text-lg font-medium text-gray-900">
        Shopping cart
      </Dialog.Title>
      <div className="ml-3 flex h-7 items-center">
        <button
          type="button"
          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
          onClick={() => closeCart()}
        >
          <XMarkIcon
            className="h-6 w-6 outline-0 border-0"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartHeader;
