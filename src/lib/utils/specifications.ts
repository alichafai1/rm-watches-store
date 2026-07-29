import type {
  ProductSpecification,
  ProductSpecifications,
} from "@/types/product";

const detailLabels: { key: keyof ProductSpecifications; label: string }[] = [
  { key: "movement", label: "Movement" },
  { key: "caseSize", label: "Case Size" },
  { key: "caseMaterial", label: "Case Material" },
  { key: "caseThickness", label: "Case Thickness" },
  { key: "crystal", label: "Crystal" },
  { key: "dialColor", label: "Dial Color" },
  { key: "strap", label: "Strap" },
  { key: "strapWidth", label: "Strap Width" },
  { key: "waterResistance", label: "Water Resistance" },
  { key: "powerReserve", label: "Power Reserve" },
];

export function specificationsFromDetails(
  details: ProductSpecifications,
): ProductSpecification[] {
  return detailLabels
    .map(({ key, label }) => ({
      label,
      value: details[key] ?? "",
    }))
    .filter((row) => row.value.trim());
}

export function normalizeProductSpecifications(options: {
  specifications?: ProductSpecification[] | null;
  specificationDetails?: ProductSpecifications | null;
}): ProductSpecification[] {
  const custom = (options.specifications ?? []).filter(
    (row) => row.label.trim() || row.value.trim(),
  );
  const fromDetails = options.specificationDetails
    ? specificationsFromDetails(options.specificationDetails)
    : [];

  if (custom.length >= fromDetails.length && custom.length > 0) {
    return custom;
  }

  if (fromDetails.length > 0) {
    return fromDetails;
  }

  return custom;
}

export function parseSpecificationRows(value: unknown): ProductSpecification[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const row = item as { label?: unknown; value?: unknown };
      const label = typeof row.label === "string" ? row.label.trim() : "";
      const rowValue = typeof row.value === "string" ? row.value.trim() : "";

      if (!label && !rowValue) {
        return null;
      }

      return { label, value: rowValue };
    })
    .filter((row): row is ProductSpecification => row !== null);
}

export function coerceSpecificationRows(value: unknown): ProductSpecification[] {
  if (Array.isArray(value)) {
    return parseSpecificationRows(value);
  }

  if (value && typeof value === "object") {
    const fromDetails = specificationsFromDetails(
      value as ProductSpecifications,
    );
    if (fromDetails.length > 0) {
      return fromDetails;
    }

    return Object.entries(value as Record<string, unknown>)
      .map(([label, rowValue]) => ({
        label,
        value: typeof rowValue === "string" ? rowValue.trim() : "",
      }))
      .filter((row) => row.label.trim() && row.value.trim());
  }

  return [];
}

/**
 * Parse a pasted specs block.
 * Supports:
 * - Tab separated: Brand\tRichard Mille
 * - Colon separated: Brand: Richard Mille
 * - Pipe separated: Brand | Richard Mille
 */
export function parseBulkSpecificationsText(
  text: string,
): ProductSpecification[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes("\t")) {
        const [label, ...rest] = line.split("\t");
        return {
          label: (label ?? "").trim(),
          value: rest.join("\t").trim(),
        };
      }

      const colonMatch = line.match(/^([^:：|]+)\s*[:：|]\s*(.+)$/);
      if (colonMatch) {
        return {
          label: colonMatch[1].trim(),
          value: colonMatch[2].trim(),
        };
      }

      const spacedMatch = line.match(/^(\S+(?:\s+\S+){0,3})\s{2,}(.+)$/);
      if (spacedMatch) {
        return {
          label: spacedMatch[1].trim(),
          value: spacedMatch[2].trim(),
        };
      }

      return null;
    })
    .filter((row): row is ProductSpecification =>
      Boolean(row && row.label && row.value),
    );
}
