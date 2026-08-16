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
    description: "Tracked delivery. Delivery times vary by destination.",
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
    id: "flypay",
    label: "flypay",
  },
];
