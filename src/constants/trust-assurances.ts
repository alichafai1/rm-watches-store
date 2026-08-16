import { websiteMediaBase } from "@/constants/payment-methods";

export type TrustAssurance = {
  description: string;
  iconAlt: string;
  iconSrc: string;
  id: string;
  title: string;
};

export const trustAssurances: TrustAssurance[] = [
  {
    id: "free-shipping",
    title: "Free Shipping",
    description: "Free shipping worldwide. Delivery times vary by destination.",
    iconSrc: `${websiteMediaBase}/free%20shipping%20icon.webp`,
    iconAlt: "Free shipping",
  },
  {
    id: "returns",
    title: "14-Day Returns",
    description: "Return requests accepted within 14 days of delivery.",
    iconSrc: `${websiteMediaBase}/days%20moneyback.webp`,
    iconAlt: "14-day returns",
  },
  {
    id: "secure-checkout",
    title: "Secure checkout powered by Stripe",
    description: "Payments are processed securely",
    iconSrc: `${websiteMediaBase}/secure%20checkout%20icon.webp`,
    iconAlt: "Secure checkout",
  },
];
