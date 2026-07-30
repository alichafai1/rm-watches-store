import { mockNewArrivalCollections } from "@/mock/new-arrival-collections";
import { mockNewArrivalProducts } from "@/mock/new-arrival-products";
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
  const fromCms = cmsProducts.filter(
    (product) =>
      product.collectionId === collection.id ||
      product.collection.slug === collection.slug,
  );
  const fromMock = mockNewArrivalProducts.filter(
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

export function getNewArrivalCollectionNavigationItems() {
  return mockNewArrivalCollections.map((collection) => ({
    label: collection.name,
    href: `/new-arrival-collections/${collection.slug}`,
  }));
}
