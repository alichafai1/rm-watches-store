import type { JsonLdObject } from "@/types/seo";

type WebsiteSchemaInput = {
  name: string;
  url: string;
};

export function createWebsiteSchema({
  name,
  url,
}: WebsiteSchemaInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  };
}
