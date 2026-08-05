export type RouteItem = {
  label: string;
  href: string;
};

export const staticRoutes: RouteItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Best Sellers", href: "/shop/best-sellers" },
  { label: "Men's Watches", href: "/shop/men" },
  { label: "Women's Watches", href: "/shop/women" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrival", href: "/new-arrival-collections" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Warranty", href: "/warranty" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund & Return Policy", href: "/refund-return-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];
