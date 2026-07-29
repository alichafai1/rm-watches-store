import type { Metadata } from "next";
import { siteConfig } from "@/constants/site";
import { canonicalUrl } from "@/lib/seo/urls";

type PageMetadataInput = {
  title: string;
  description?: string;
  pathname?: string;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  pathname = "/",
}: PageMetadataInput): Metadata {
  const url = canonicalUrl(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
