import { createContext, ReactNode, useContext, useState } from "react";

import ShoppingCart from "../components/organisms/ShoppingCart/ShoppingCart";
import { useLocalStorage } from "../hooks/LocalStorageHook";
import Item from "../models/Item";
import { ShoppingCartItem } from "../models/ShoppingCart";

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ShoppingCartContext {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  addToCart: (newITem: Item, size: string, quantity: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  emptyCart: () => void;
  cartQuantity: number;
  cartItems: ShoppingCartItem[];
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<ShoppingCartItem[]>(
    "shopping-cart",
    []
  );

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setOpen(true);

  const closeCart = () => setOpen(false);

  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.item.id === id)?.quantity || 0;
  };

  const addToCart = (newItem: Item, size: string, quantity: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.item.id === newItem.id) == null) {
        return [
          ...currItems,
          { item: newItem, quantity: quantity, itemSize: size },
        ];
      } else {
        return currItems.map((item) => {
          if (item.item.id === newItem.id) {
            return { ...item, quantity: item.quantity + quantity };
          } else {
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.item.id !== id);
    });
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        addToCart,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        emptyCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart open={open} />
    </ShoppingCartContext.Provider>
  );
};
