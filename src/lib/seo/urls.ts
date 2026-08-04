import { siteConfig } from "@/constants/site";

export function absoluteUrl(pathname = "/") {
  try {
    const url = new URL(pathname);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    // Relative storefront paths are resolved against the configured site URL.
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, siteConfig.url).toString();
}

export function canonicalUrl(pathname = "/") {
  return absoluteUrl(pathname);
}
