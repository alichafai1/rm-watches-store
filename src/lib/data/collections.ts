import { mockCollections } from "@/mock/collections";
import { getPublishedCmsProducts } from "@/lib/data/cms-products";
import type { Collection } from "@/types/collection";

export function getCollections() {
  return mockCollections;
}

export function getCollectionBySlug(slug: string) {
  return mockCollections.find((collection) => collection.slug === slug);
}

/** Old URLs like /collections/collection-1 still resolve for redirects. */
export function getCollectionByLegacySlug(slug: string) {
  const match = /^collection-(\d+)$/.exec(slug);
  if (!match) {
    return undefined;
  }

  return mockCollections.find((collection) => collection.id === match[1]);
}

export function getFeaturedCollections(limit = 20) {
  return mockCollections.slice(0, limit);
}

export async function getCollectionProducts(collection: Collection) {
  const cmsProducts = await getPublishedCmsProducts();

  return cmsProducts.filter(
    (product) =>
      product.collectionId === collection.id ||
      product.collection.slug === collection.slug,
  );
}

export function getCollectionNavigationItems() {
  return mockCollections.map((collection) => ({
    label: collection.name,
    href: `/collections/${collection.slug}`,
  }));
}
