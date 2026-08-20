import { getProductRmModelRef } from "@/lib/products/rm-model";
import type { Product } from "@/types/product";

export type RelatedProductSource = Pick<
  Product,
  "id" | "title" | "collectionId" | "collection" | "specifications"
>;

function isExactModelMatch(
  product: RelatedProductSource,
  candidate: RelatedProductSource,
) {
  const current = getProductRmModelRef(product);
  const other = getProductRmModelRef(candidate);
  return Boolean(current && other && current.exact === other.exact);
}

function isFamilyOrCollectionMatch(
  product: RelatedProductSource,
  candidate: RelatedProductSource,
) {
  if (candidate.collectionId === product.collectionId) return true;

  const current = getProductRmModelRef(product);
  const other = getProductRmModelRef(candidate);
  return Boolean(current && other && current.family === other.family);
}

/**
 * Rank related products by exact RM model, then the same family/collection.
 * Preserves the incoming catalog order within each group. Does not pad with
 * unrelated products if fewer than `limit` genuine matches exist.
 */
export function selectRelatedProducts<T extends RelatedProductSource>(
  product: T,
  catalog: T[],
  limit = 4,
): T[] {
  if (limit <= 0) return [];

  const exact: T[] = [];
  const familyOrCollection: T[] = [];

  for (const candidate of catalog) {
    if (candidate.id === product.id) continue;

    if (isExactModelMatch(product, candidate)) {
      exact.push(candidate);
      continue;
    }

    if (isFamilyOrCollectionMatch(product, candidate)) {
      familyOrCollection.push(candidate);
    }
  }

  return [...exact, ...familyOrCollection].slice(0, limit);
}
