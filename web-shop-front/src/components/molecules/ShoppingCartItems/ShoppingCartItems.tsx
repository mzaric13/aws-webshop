import { useShoppingCart } from "../../../context/ShoppingCartContext";
import ShoppingCartItemComp from "../../atoms/ShoppingCartItemComp/ShoppingCartItemComp";

const ShoppingCartItems = () => {
  const { cartItems } = useShoppingCart();

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul className="-my-6 divide-y divide-gray-200">
          {cartItems.map((cartItem, index) => (
            <ShoppingCartItemComp key={index} cartItem={cartItem} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShoppingCartItems;
