import { mockCollections } from "@/mock/collections";
import { mockProducts } from "@/mock/products";
import { getPublishedCmsProducts } from "@/lib/data/cms-products";
import type { Collection } from "@/types/collection";

export function getCollections() {
  return mockCollections;
}

export function getCollectionBySlug(slug: string) {
  return mockCollections.find((collection) => collection.slug === slug);
}

export function getFeaturedCollections(limit = 20) {
  return mockCollections.slice(0, limit);
}

export async function getCollectionProducts(collection: Collection) {
  const cmsProducts = await getPublishedCmsProducts();
  const fromCms = cmsProducts.filter(
    (product) =>
      product.collectionId === collection.id ||
      product.collection.slug === collection.slug,
  );
  const fromMock = mockProducts.filter(
    (product) =>
      product.collectionId === collection.id ||
      product.collection.slug === collection.slug,
  );

  const bySlug = new Map(fromCms.map((product) => [product.slug, product]));
  for (const product of fromMock) {
    if (!bySlug.has(product.slug)) {
      bySlug.set(product.slug, product);
    }
  }

  return Array.from(bySlug.values());
}

export function getCollectionNavigationItems() {
  return mockCollections.map((collection) => ({
    label: collection.name,
    href: `/collections/${collection.slug}`,
  }));
}
