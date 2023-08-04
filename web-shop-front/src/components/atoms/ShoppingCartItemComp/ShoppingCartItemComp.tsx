import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { ShoppingCartItem } from "../../../models/ShoppingCart";

interface ShoppingCartItemProps {
  cartItem: ShoppingCartItem;
}

const ShoppingCartItemComp = ({ cartItem }: ShoppingCartItemProps) => {
  const { removeFromCart } = useShoppingCart();

  return (
    <li key={cartItem.item.id} className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            cartItem.item.pictures
              ? cartItem.item.pictures[0]
              : "/no-image-available.jpeg"
          }
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{cartItem.item.name}</h3>
            <p className="ml-4">${cartItem.item.price}</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">Quantity: {cartItem.quantity}</p>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-[#232f3e] hover:text-[#f90]"
              onClick={() => removeFromCart(cartItem.item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ShoppingCartItemComp;
