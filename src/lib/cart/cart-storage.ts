import type { CartItem } from "@/types/cart";

export const CART_STORAGE_KEY = "rm-watches-cart-v1";
export const MAX_ITEM_QUANTITY = 99;

/**
 * Variants of the same product are separate lines, so the key has to include
 * the variant name rather than just the product id.
 */
export function createCartItemId(productId: string, variantName?: string) {
  return variantName ? `${productId}::${variantName}` : productId;
}

export function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.currency === "string" &&
    typeof item.unitPrice === "number" &&
    Number.isFinite(item.unitPrice) &&
    typeof item.quantity === "number"
  );
}

/**
 * Anything stored in localStorage can be edited by hand or left behind by an
 * older build, so every entry is re-validated instead of trusted.
 */
export function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartItem).map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity),
    }));
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private browsing and full quotas both reject writes; the in-memory cart
    // still works for the rest of the session.
  }
}
