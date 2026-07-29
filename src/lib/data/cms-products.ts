import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CmsProductRecord } from "@/types/cms";
import type {
  Product,
  ProductAbout,
  ProductSpecifications,
  ProductVariant,
} from "@/types/product";
import { coerceSpecificationRows } from "@/lib/utils/specifications";

const emptySpecificationDetails: ProductSpecifications = {
  movement: "",
  caseSize: "",
  caseMaterial: "",
  caseThickness: "",
  crystal: "",
  dialColor: "",
  strap: "",
  strapWidth: "",
  waterResistance: "",
  powerReserve: "",
};

function defaultVariants(price: number): ProductVariant[] {
  return [
    { name: "AAAAA Clone", price, description: "" },
    { name: "1:1 Clone", price, description: "" },
    { name: "Top 1:1 Clone", price, description: "" },
  ];
}

function defaultAbout(
  title: string,
  description: string,
  image?: Product["images"][number],
): ProductAbout {
  return {
    title: "About This Watch",
    description: description || `${title} product details.`,
    image: image ?? {
      url: "/images/placeholders/watch-placeholder.svg",
      alt: title,
      width: 800,
      height: 800,
    },
  };
}

export function mapCmsProductToProduct(record: CmsProductRecord): Product {
  const images = Array.isArray(record.images) ? record.images : [];
  const specifications = coerceSpecificationRows(record.specification_details);
  const price = Number(record.price) || 0;
  const about =
    record.about &&
    typeof record.about === "object" &&
    "title" in record.about &&
    record.about.title
      ? record.about
      : defaultAbout(record.title, record.description || "", images[0]);

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description:
      record.description ||
      (record.about && "description" in record.about
        ? String(record.about.description ?? "")
        : "") ||
      "",
    price,
    compareAtPrice: record.compare_at_price ?? undefined,
    currency: record.currency || "USD",
    images:
      images.length > 0
        ? images
        : [
            {
              url: "/images/placeholders/watch-placeholder.svg",
              alt: record.title,
              width: 800,
              height: 800,
            },
          ],
    collectionId: record.collection_id,
    collection: {
      id: record.collection_id,
      name: record.collection_name || "Collection",
      slug: record.collection_slug || "collection",
    },
    gender: record.gender || "unisex",
    movement: record.movement || "automatic",
    style: record.style || "sport",
    specifications,
    specificationDetails: emptySpecificationDetails,
    variants:
      Array.isArray(record.variants) && record.variants.length > 0
        ? record.variants
        : defaultVariants(price),
    features: Array.isArray(record.features) ? record.features : [],
    about,
    reviews: Array.isArray(record.reviews) ? record.reviews : [],
    faq: Array.isArray(record.faq) ? record.faq : [],
    stock: record.stock || "in_stock",
    isNewArrival: Boolean(record.is_new_arrival),
    isBestSeller: Boolean(record.is_best_seller),
    seoTitle: record.seo_title ?? undefined,
    seoDescription: record.seo_description ?? undefined,
  };
}

export async function getPublishedCmsProducts(): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cms_products")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return (data as CmsProductRecord[]).map(mapCmsProductToProduct);
  } catch {
    return [];
  }
}

export async function getPublishedCmsProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cms_products")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapCmsProductToProduct(data as CmsProductRecord);
  } catch {
    return null;
  }
}
