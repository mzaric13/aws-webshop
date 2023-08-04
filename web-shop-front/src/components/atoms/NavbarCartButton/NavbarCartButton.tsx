import { IoCart } from "react-icons/io5";
import { useShoppingCart } from "../../../context/ShoppingCartContext";

const NavbarCartButton = () => {
  const { cartQuantity, openCart } = useShoppingCart();

  return (
    <div className="relative py-2 mr-2" onClick={() => openCart()}>
      <div className="t-0 absolute left-3 cursor-pointer">
        <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
          {cartQuantity}
        </p>
      </div>
      <IoCart className="text-white m-2 cursor-pointer" size={30} />
    </div>
  );
};

export default NavbarCartButton;
