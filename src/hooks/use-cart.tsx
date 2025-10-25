"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { CartItem, Product } from "@/types";
import { useToast } from "./use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, shade?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback(
    (product: Product, quantity: number, shade?: string) => {
      setCartItems((prevItems) => {
        const cartItemId = shade ? `${product.id}_${shade}` : product.id;
        const existingItem = prevItems.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          return prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prevItems,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
            shade,
          },
        ];
      });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name}${shade ? ` (${shade})` : ''}`,
      });
    },
    [toast]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
