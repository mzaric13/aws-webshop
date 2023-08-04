import { Link } from "react-router-dom";
import { useShoppingCart } from "../../../context/ShoppingCartContext";

const ShoppingCartFooter = () => {
  const { cartItems } = useShoppingCart();

  const calculatePrice = (): number => {
    let price = 0;
    for (let cartItem of cartItems)
      price += cartItem.item.price * cartItem.quantity;
    return price;
  };

  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Total</p>
        <p>${calculatePrice()}</p>
      </div>
      <div className="mt-6">
        <Link
          to="/checkout"
          className="flex items-center justify-center rounded-md border border-transparent bg-[#232f3e] px-6 py-3 text-base font-medium text-white shadow-sm"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCartFooter;
