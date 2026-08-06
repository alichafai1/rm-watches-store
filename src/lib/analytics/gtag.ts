/**
 * Lightweight GA4 helpers. The Measurement ID is public by design (G-…);
 * analytics is disabled when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export function isAnalyticsEnabled() {
  return GA_MEASUREMENT_ID.length > 0;
}

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  window.gtag?.(...args);
}

export function trackPageView(url: string) {
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent(name: string, params?: EventParams) {
  gtag("event", name, params);
}

export function trackViewItem(input: {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}) {
  trackEvent("view_item", {
    currency: input.currency,
    value: input.value,
    items: input.items,
  });
}

export function trackAddToCart(input: {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}) {
  trackEvent("add_to_cart", {
    currency: input.currency,
    value: input.value,
    items: input.items,
  });
}

export function trackBeginCheckout(input: {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}) {
  trackEvent("begin_checkout", {
    currency: input.currency,
    value: input.value,
    items: input.items,
  });
}

/** Ready for a real payment provider; do not call with fake transaction data. */
export function trackPurchase(input: {
  transaction_id: string;
  currency: string;
  value: number;
  shipping?: number;
  items: AnalyticsItem[];
}) {
  trackEvent("purchase", {
    transaction_id: input.transaction_id,
    currency: input.currency,
    value: input.value,
    shipping: input.shipping,
    items: input.items,
  });
}
