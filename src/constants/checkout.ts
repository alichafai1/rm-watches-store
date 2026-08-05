export type CheckoutShippingOption = {
  badge?: string;
  description: string;
  id: string;
  label: string;
  price: number;
};

export type CheckoutPaymentOption = {
  description?: string;
  id: string;
  label: string;
};

export const checkoutShippingOptions: CheckoutShippingOption[] = [
  {
    id: "free",
    label: "Free Shipping",
    description: "Tracked delivery, expected in 2–3 business days",
    badge: "Free",
    price: 0,
  },
];

/**
 * Rename this to match whichever gateway is connected; the row renders the
 * label with the accepted card and wallet icons beside it.
 */
export const checkoutPaymentOptions: CheckoutPaymentOption[] = [
  {
    id: "secure-payment",
    label: "Secure Payment",
    description: "Card and wallet payments, processed on an encrypted connection",
  },
];
