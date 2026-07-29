import type { JsonLdObject } from "@/types/seo";

type OrganizationSchemaInput = {
  name: string;
  url: string;
  logoUrl?: string;
};

export function createOrganizationSchema({
  name,
  url,
  logoUrl,
}: OrganizationSchemaInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logoUrl ? { logo: logoUrl } : {}),
  };
}
