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
    description: "Expected delivery between 2–3 days",
    iconSrc: `${websiteMediaBase}/free%20shipping%20icon.webp`,
    iconAlt: "Free shipping",
  },
  {
    id: "returns",
    title: "30 Days Return",
    description: "Return label included for easy returns",
    iconSrc: `${websiteMediaBase}/days%20moneyback.webp`,
    iconAlt: "30 days return",
  },
  {
    id: "secure-checkout",
    title: "Secure checkout powered by Stripe",
    description: "Payments are processed securely",
    iconSrc: `${websiteMediaBase}/secure%20checkout%20icon.webp`,
    iconAlt: "Secure checkout",
  },
];
