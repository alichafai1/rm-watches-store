export const siteConfig = {
  name: "RM Watches Store",
  description:
    "Explore premium Richard Mille-inspired watches, detailed buying guides, and expert watch articles.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://rm-watches-store-two.vercel.app",
  locale: "en",
} as const;
