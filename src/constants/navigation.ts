export type NavigationItem = {
  label: string;
  href: string;
};

export type CommerceUtilityAction = {
  id: "search" | "account" | "wishlist" | "cart";
  label: string;
};

export type FooterNavigationGroup = {
  title: string;
  links: NavigationItem[];
};

export type AnnouncementConfig = {
  enabled: boolean;
  message: string;
  link?: NavigationItem;
};

export const announcementBar: AnnouncementConfig = {
  enabled: true,
  message: "Free shipping worldwide",
};

export const mainNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  {
    label: "New Arrival",
    href: "/new-arrival-collections",
  },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const utilityNavigation: NavigationItem[] = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const commerceUtilityActions: CommerceUtilityAction[] = [
  { id: "search", label: "Search placeholder" },
  { id: "account", label: "Account placeholder" },
  { id: "wishlist", label: "Wishlist placeholder" },
  { id: "cart", label: "Cart placeholder" },
];

export const footerNavigationGroups: FooterNavigationGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "All Watches", href: "/shop" },
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Best Sellers", href: "/shop/best-sellers" },
      { label: "Men", href: "/shop/men" },
      { label: "Women", href: "/shop/women" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Collections", href: "/collections" },
      { label: "Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund & Return Policy", href: "/refund-return-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Customer Care",
    links: [{ label: "Contact", href: "/contact" }],
  },
];
