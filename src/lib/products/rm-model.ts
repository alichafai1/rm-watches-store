import type { Product } from "@/types/product";

export type RmModelRef = {
  /** Canonical exact reference, e.g. "35-02", "11-04", "7-01", "35". */
  exact: string;
  /** Canonical family, e.g. "35", "11", "7". */
  family: string;
};

const rmReferencePattern =
  /RM\s*0*(\d{1,3})(?:\s*[-–]\s*0*(\d{1,2}))?/i;

export function parseRmModelRef(value: string): RmModelRef | null {
  const match = value.match(rmReferencePattern);
  if (!match?.[1]) return null;

  const major = String(Number(match[1]));
  if (!major || Number.isNaN(Number(major))) return null;

  const variant = match[2] ? match[2].padStart(2, "0") : null;
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
