import { getCollectionBySlug } from "@/lib/data/collections";
import { getNewArrivalCollectionBySlug } from "@/lib/data/new-arrival-collections";
import {
  getPublishedCmsProductBySlug,
  getPublishedCmsProducts,
} from "@/lib/data/cms-products";
import type { Product } from "@/types/product";

export function getProductCollectionPath(slug: string) {
  // New-arrival collections use name-based slugs (e.g. rm-07-01), not only
  // the legacy "new-arrival-N" prefix — look up the registry before defaulting
  // to /collections/, or product breadcrumbs link to 404s.
  if (
    slug.startsWith("new-arrival-") ||
    Boolean(getNewArrivalCollectionBySlug(slug))
  ) {
    return `/new-arrival-collections/${slug}`;
  }

  return `/collections/${slug}`;
}

export async function getProducts() {
  return getPublishedCmsProducts();
}

export async function getProductBySlug(slug: string) {
  return getPublishedCmsProductBySlug(slug);
}

export async function getNewArrivalProducts() {
  const products = await getProducts();
  return products.filter((product) => product.isNewArrival);
}

export async function getBestSellerProducts() {
  const products = await getProducts();
  return products.filter((product) => product.isBestSeller);
}

export async function getHomepageBestSellerProducts(limit = 4) {
  const products = await getBestSellerProducts();
  return products.slice(0, limit);
}

export async function getHomepageNewArrivalProducts(limit = 4) {
  const products = await getNewArrivalProducts();
  return products.slice(0, limit);
}

export function getPrimaryProductCollection(product: Product) {
  return (
    getCollectionBySlug(product.collection.slug) ??
    getNewArrivalCollectionBySlug(product.collection.slug) ??
    product.collection
  );
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const catalog = await getProducts();
  const related = catalog.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.collectionId === product.collectionId,
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const fallback = catalog.filter(
    (candidate) =>
      candidate.id !== product.id &&
      !related.some((relatedProduct) => relatedProduct.id === candidate.id),
  );

  return [...related, ...fallback].slice(0, limit);
}
