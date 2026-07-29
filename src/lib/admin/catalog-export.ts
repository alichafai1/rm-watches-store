import type { CmsProductRecord } from "@/types/cms";
import type { ProductImage } from "@/types/product";

/** Portable catalog row for reuse in other website builders. */
export type ProductCatalogRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  description_image: ProductImage | null;
  gallery_images: ProductImage[];
  price: number;
  compare_at_price: number | null;
  currency: string;
  specifications: CmsProductRecord["specification_details"];
  features: string[];
  reviews: CmsProductRecord["reviews"];
  faq: CmsProductRecord["faq"];
  variants: CmsProductRecord["variants"];
  collection_id: string;
  collection_name: string;
  collection_slug: string;
  gender: string;
  movement: string;
  style: string;
  stock: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function asImage(value: unknown): ProductImage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const image = value as Partial<ProductImage>;
  if (typeof image.url !== "string" || !image.url.trim()) {
    return null;
  }

  return {
    url: image.url,
    alt: typeof image.alt === "string" ? image.alt : "",
    width: Number(image.width) || 800,
    height: Number(image.height) || 800,
  };
}

export function toCatalogRow(record: CmsProductRecord): ProductCatalogRow {
  const gallery = Array.isArray(record.images) ? record.images : [];
  const descriptionImage =
    asImage(record.description_image) ||
    asImage(record.about?.image) ||
    null;

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    description:
      record.description ||
      (record.about && "description" in record.about
        ? String(record.about.description ?? "")
        : "") ||
      "",
    description_image: descriptionImage,
    gallery_images: gallery,
    price: Number(record.price) || 0,
    compare_at_price: record.compare_at_price,
    currency: record.currency || "USD",
    specifications: record.specification_details ?? [],
    features: Array.isArray(record.features) ? record.features : [],
    reviews: Array.isArray(record.reviews) ? record.reviews : [],
    faq: Array.isArray(record.faq) ? record.faq : [],
    variants: Array.isArray(record.variants) ? record.variants : [],
    collection_id: record.collection_id,
    collection_name: record.collection_name,
    collection_slug: record.collection_slug,
    gender: record.gender,
    movement: record.movement,
    style: record.style,
    stock: record.stock,
    is_new_arrival: Boolean(record.is_new_arrival),
    is_best_seller: Boolean(record.is_best_seller),
    seo_title: record.seo_title,
    seo_description: record.seo_description,
    status: record.status,
    published_at: record.published_at,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

const CSV_COLUMNS: Array<keyof ProductCatalogRow> = [
  "id",
  "title",
  "slug",
  "description",
  "description_image",
  "gallery_images",
  "price",
  "compare_at_price",
  "currency",
  "specifications",
  "features",
  "reviews",
  "faq",
  "variants",
  "collection_id",
  "collection_name",
  "collection_slug",
  "gender",
  "movement",
  "style",
  "stock",
  "is_new_arrival",
  "is_best_seller",
  "seo_title",
  "seo_description",
  "status",
  "published_at",
  "created_at",
  "updated_at",
];

function csvEscape(value: unknown) {
  const text =
    value === null || value === undefined
      ? ""
      : typeof value === "string"
        ? value
        : JSON.stringify(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function catalogToJson(rows: ProductCatalogRow[]) {
  return `${JSON.stringify(rows, null, 2)}\n`;
}

export function catalogToCsv(rows: ProductCatalogRow[]) {
  const header = CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((column) => csvEscape(row[column])).join(","),
  );
  return `${[header, ...lines].join("\n")}\n`;
}
