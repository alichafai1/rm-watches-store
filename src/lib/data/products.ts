import { mockProducts } from "@/mock/products";
import { mockNewArrivalProducts } from "@/mock/new-arrival-products";
import { getCollectionBySlug } from "@/lib/data/collections";
import { getNewArrivalCollectionBySlug } from "@/lib/data/new-arrival-collections";
import {
  getPublishedCmsProductBySlug,
  getPublishedCmsProducts,
} from "@/lib/data/cms-products";
import type { Product } from "@/types/product";

function getMockProducts() {
  return [...mockProducts, ...mockNewArrivalProducts];
}

function mergeCatalog(cmsProducts: Product[], mockProductsList: Product[]) {
  const bySlug = new Map<string, Product>();

  // Published CMS products first so they surface on homepage / shop lists
  for (const product of cmsProducts) {
    bySlug.set(product.slug, product);
  }

  for (const product of mockProductsList) {
    if (!bySlug.has(product.slug)) {
      bySlug.set(product.slug, product);
    }
  }

  return Array.from(bySlug.values());
}

export function getProductCollectionPath(slug: string) {
  if (slug.startsWith("new-arrival-")) {
    return `/new-arrival-collections/${slug}`;
  }

  return `/collections/${slug}`;
}

export async function getProducts() {
  const cmsProducts = await getPublishedCmsProducts();
  return mergeCatalog(cmsProducts, getMockProducts());
}

export async function getProductBySlug(slug: string) {
  const cmsProduct = await getPublishedCmsProductBySlug(slug);
  if (cmsProduct) {
    return cmsProduct;
  }

  return getMockProducts().find((product) => product.slug === slug);
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

export async function getProductsByGender(gender: "men" | "women") {
  const products = await getProducts();
  return products.filter((product) => product.gender === gender);
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
