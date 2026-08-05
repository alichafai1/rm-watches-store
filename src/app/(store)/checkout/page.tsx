import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { createPageMetadata } from "@/lib/seo/metadata";

const baseMetadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your order securely.",
  pathname: "/checkout",
});

export const metadata: Metadata = {
  ...baseMetadata,
  // A cart-specific page has nothing to rank for and should stay out of search.
  robots: { follow: false, index: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
