const supabaseMediaBase =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ??
  "https://jolmyqqzsqvyapoixnqh.supabase.co";

export const websiteMediaBase = `${supabaseMediaBase}/storage/v1/object/public/website-media`;

type PaymentMethod = {
  name: string;
  /** Path inside the `website-media` bucket (URL-encoded if needed). */
  path: string;
};

/**
 * Upload WEBP icons to the Supabase `website-media` bucket.
 * Add each new file path here when ready.
 */
export const paymentMethods: PaymentMethod[] = [
  { name: "Visa", path: "visa icon.webp" },
  { name: "Mastercard", path: "mastercard icon.webp" },
  { name: "American Express", path: "american express icon.webp" },
  { name: "PayPal", path: "paypal icon.webp" },
  { name: "Apple Pay", path: "appl pay icon.webp" },
  { name: "Google Pay", path: "google pay icon.webp" },
];

export function paymentIconUrl(path: string) {
  return `${websiteMediaBase}/${path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}
