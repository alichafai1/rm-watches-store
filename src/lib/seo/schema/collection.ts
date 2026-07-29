import type { Collection } from "@/types/collection";
import type { JsonLdObject } from "@/types/seo";

export function createCollectionSchema(
  collection: Collection,
  url: string,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url,
  };
}
