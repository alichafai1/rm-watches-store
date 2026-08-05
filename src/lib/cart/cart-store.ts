import {
  CART_STORAGE_KEY,
  clampQuantity,
  createCartItemId,
  readStoredCart,
  writeStoredCart,
} from "@/lib/cart/cart-storage";
import type { CartItem, CartItemInput } from "@/types/cart";

export type CartState = {
  /** False until localStorage has been read, so the UI can avoid a flash. */
  isHydrated: boolean;
  items: CartItem[];
};

/**
 * The cart lives outside React so the server render, every component, and any
 * other tab all read one source of truth. Snapshots are frozen objects because
 * useSyncExternalStore compares them by reference.
 */
const emptyState: CartState = { isHydrated: false, items: [] };

let state: CartState = emptyState;
const listeners = new Set<() => void>();

function publish(items: CartItem[]) {
  state = { isHydrated: true, items };
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY) return;
  publish(readStoredCart());
}

export function subscribeToCart(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
  }
  listeners.add(listener);

  if (!state.isHydrated) {
    publish(readStoredCart());
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getCartSnapshot() {
  return state;
}

export function getCartServerSnapshot() {
  return emptyState;
}

function commit(items: CartItem[]) {
  writeStoredCart(items);
  publish(items);
}

export function addCartItem(input: CartItemInput, quantity = 1) {
  const id = createCartItemId(input.productId, input.variantName);
  const amount = clampQuantity(quantity);
  const existing = state.items.find((line) => line.id === id);

  commit(
    existing
      ? state.items.map((line) =>
          line.id === id
            ? {
                ...line,
                ...input,
                id,
                quantity: clampQuantity(line.quantity + amount),
              }
            : line,
        )
      : [...state.items, { ...input, id, quantity: amount }],
  );
}

export function updateCartItemQuantity(id: string, quantity: number) {
  commit(
    quantity < 1
      ? state.items.filter((line) => line.id !== id)
      : state.items.map((line) =>
          line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line,
        ),
  );
}

export function removeCartItem(id: string) {
  commit(state.items.filter((line) => line.id !== id));
}

export function clearCart() {
  commit([]);
}
