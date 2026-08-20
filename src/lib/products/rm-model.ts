import type { Product } from "@/types/product";

export type RmModelRef = {
  /** Canonical exact reference, e.g. "35-02", "11-04", "7-01", "35", "007". */
  exact: string;
  /** Canonical family, e.g. "35", "11", "7", "007". */
  family: string;
};

const rmReferencePattern =
  /RM\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,2}))?/i;

/**
 * Strip leading zeros for family matching, except three-digit padded
 * single-digit models with no hyphenated variant (RM 001 / 002 / 007).
 * Those stay distinct from RM 07-xx (family "7").
 *
 * RM 035 and RM 027 still collapse to 35 / 27 so they family-match
 * RM 35-xx and RM 27-xx.
 */
function canonicalMajor(rawMajor: string, hasVariant: boolean) {
  const stripped = String(Number(rawMajor));
  if (!stripped || Number.isNaN(Number(rawMajor))) return null;

  if (!hasVariant && rawMajor.length === 3 && stripped.length === 1) {
    return rawMajor;
  }

  return stripped;
}

export function parseRmModelRef(value: string): RmModelRef | null {
  const match = value.match(rmReferencePattern);
  if (!match?.[1]) return null;

  const variant = match[2]
    ? String(Number(match[2])).padStart(2, "0")
    : null;
  const major = canonicalMajor(match[1], Boolean(variant));
  if (!major) return null;

  return {
    exact: variant ? `${major}-${variant}` : major,
    family: major,
  };
}

function specificationValue(
  product: Pick<Product, "specifications">,
  label: string,
) {
  const row = product.specifications.find(
    (item) => item.label.trim().toLowerCase() === label,
  );
  return row?.value?.trim() ?? "";
}

/**
 * Reads an RM reference from product data without changing stored copy.
 * Prefers Model, then Range, then title, then collection name.
 */
export function getProductRmModelRef(
  product: Pick<Product, "title" | "collection" | "specifications">,
): RmModelRef | null {
  const sources = [
    specificationValue(product, "model"),
    specificationValue(product, "range"),
    product.title,
    product.collection.name,
  ];

  for (const source of sources) {
    const parsed = parseRmModelRef(source);
    if (parsed) return parsed;
  }

  return null;
}
