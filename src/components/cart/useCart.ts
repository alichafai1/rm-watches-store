"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  addCartItem,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  removeCartItem,
  subscribeToCart,
  updateCartItemQuantity,
} from "@/lib/cart/cart-store";

export function useCart() {
  const { isHydrated, items } = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  return useMemo(() => {
    const subtotal = items.reduce(
      (total, line) => total + line.unitPrice * line.quantity,
      0,
    );

    return {
      addItem: addCartItem,
      clearCart,
      currency: items[0]?.currency ?? ("USD" as const),
      isHydrated,
      itemCount: items.reduce((total, line) => total + line.quantity, 0),
      items,
      removeItem: removeCartItem,
      subtotal: Math.round(subtotal * 100) / 100,
      updateQuantity: updateCartItemQuantity,
    };
  }, [isHydrated, items]);
}
