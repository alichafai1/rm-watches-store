import type { CurrencyCode } from "@/types/product";

export function formatPrice(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(amount);
}
