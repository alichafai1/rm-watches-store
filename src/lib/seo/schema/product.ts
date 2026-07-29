import type { Product } from "@/types/product";
import type { JsonLdObject } from "@/types/seo";

export function createProductSchema(product: Product, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.about?.description || product.title,
    url,
  };
}
