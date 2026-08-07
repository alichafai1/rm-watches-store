const PRODUCTION_SITE_URL = "https://www.rm-replica.com";

/**
 * Canonical site origin for sitemap, robots, metadataBase, and absolute URLs.
 * Prefer NEXT_PUBLIC_SITE_URL when set to a real production host; never fall
 * back to or keep a *.vercel.app preview hostname.
 */
function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return PRODUCTION_SITE_URL;
  }

  try {
    const parsed = new URL(configured);
    if (parsed.hostname.endsWith(".vercel.app")) {
      return PRODUCTION_SITE_URL;
    }
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export const siteConfig = {
  name: "RM Watches Store",
  description:
    "Explore premium Richard Mille-inspired watches, detailed buying guides, and expert watch articles.",
  url: resolveSiteUrl(),
  locale: "en",
} as const;
