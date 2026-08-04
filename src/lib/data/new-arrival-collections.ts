import { mockNewArrivalCollections } from "@/mock/new-arrival-collections";
import { getPublishedCmsProducts } from "@/lib/data/cms-products";
import type { Collection } from "@/types/collection";

export function getNewArrivalCollections() {
  return mockNewArrivalCollections;
}

export function getNewArrivalCollectionBySlug(slug: string) {
  return mockNewArrivalCollections.find(
    (collection) => collection.slug === slug,
  );
}

/** Old URLs like /new-arrival-collections/new-arrival-1 still resolve for redirects. */
export function getNewArrivalCollectionByLegacySlug(slug: string) {
  const match = /^new-arrival-(\d+)$/.exec(slug);
  if (!match) {
    return undefined;
  }

  return mockNewArrivalCollections.find(
    (collection) => collection.id === `na-${match[1]}`,
  );
}

export function getFeaturedNewArrivalCollections(limit = 23) {
  return mockNewArrivalCollections.slice(0, limit);
}

export async function getNewArrivalCollectionProducts(collection: Collection) {
  const cmsProducts = await getPublishedCmsProducts();

  return cmsProducts.filter(
    (product) =>
      product.collectionId === collection.id ||
      product.collection.slug === collection.slug,
  );
}

export function getNewArrivalCollectionNavigationItems() {
  return mockNewArrivalCollections.map((collection) => ({
    label: collection.name,
    href: `/new-arrival-collections/${collection.slug}`,
  }));
}
