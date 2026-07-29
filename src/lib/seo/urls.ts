import { siteConfig } from "@/constants/site";

export function absoluteUrl(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, siteConfig.url).toString();
}

export function canonicalUrl(pathname = "/") {
  return absoluteUrl(pathname);
}
