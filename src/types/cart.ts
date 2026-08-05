import type { CurrencyCode } from "@/types/product";

export type CartItemImage = {
  alt: string;
  url: string;
};

export type CartItem = {
  compareAtPrice?: number;
  currency: CurrencyCode;
  /** Stable key combining product and variant, so variants stack separately. */
  id: string;
  image?: CartItemImage;
  productId: string;
  quantity: number;
  slug: string;
  title: string;
  unitPrice: number;
  variantName?: string;
};

export type CartItemInput = Omit<CartItem, "id" | "quantity">;
