"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireAdminDb } from "@/lib/auth/admin";
import { parseSpecificationRows } from "@/lib/utils/specifications";
import { sanitizeAboutHtml } from "@/lib/utils/rich-text";
import {
  parseAndSanitizeArticleBlocks,
  serializeArticleContent,
} from "@/lib/utils/article-html";
import type { CmsArticleRecord, CmsProductRecord } from "@/types/cms";

const statusSchema = z.enum(["draft", "published", "archived"]);
const articleTypeSchema = z.enum(["blog", "guide"]);
const articleImageSchema = z.object({
  url: z.string().trim().max(2_000).refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Cover image URL must use HTTP or HTTPS."),
  alt: z.string().trim().max(500),
  width: z.number().int().min(0).max(20_000),
  height: z.number().int().min(0).max(20_000),
  fit: z.enum(["cover", "contain"]).optional(),
  objectClassName: z.string().max(500).optional(),
}).strict();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMoney(value: FormDataEntryValue | number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? "")
    .trim()
    .replace(/,/g, "");
  if (!raw) {
    return 0;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseJsonArray(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function omitKey<T extends object, K extends keyof T>(value: T, key: K): Omit<T, K> {
  const copy = { ...value };
  delete copy[key];
  return copy;
}

function parseLines(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const { createServerSupabaseAuthClient } = await import(
    "@/lib/supabase/auth-server"
  );
  const { isAdminUser } = await import("@/lib/auth/admin");

  const supabase = await createServerSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(`/admin/login?error=invalid`);
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=unauthorized`);
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function adminLogoutAction() {
  const { createServerSupabaseAuthClient } = await import(
    "@/lib/supabase/auth-server"
  );
  const supabase = await createServerSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function parseProductImage(
  value: FormDataEntryValue | null,
): CmsProductRecord["description_image"] {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      const first = parsed[0];
      if (
        first &&
        typeof first === "object" &&
        "url" in first &&
        typeof (first as { url: unknown }).url === "string"
      ) {
        return first as NonNullable<CmsProductRecord["description_image"]>;
      }
      return null;
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "url" in parsed &&
      typeof (parsed as { url: unknown }).url === "string"
    ) {
      return parsed as NonNullable<CmsProductRecord["description_image"]>;
    }
  } catch {
    return null;
  }

  return null;
}

export async function saveProductAction(formData: FormData) {
  const { supabase } = await requireAdminDb();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const status = statusSchema.parse(String(formData.get("status") ?? "draft"));
  const basePrice = parseMoney(formData.get("price"));
  const compareAtRaw = String(formData.get("compare_at_price") ?? "").trim();
  const compare_at_price =
    compareAtRaw === "" ? null : parseMoney(compareAtRaw);
  const images = parseJsonArray(formData.get("images")) as CmsProductRecord["images"];
  const description_image =
    parseProductImage(formData.get("description_image")) ??
    images[0] ??
    null;
  const features = parseLines(formData.get("features"));
  const specifications = parseSpecificationRows(
    parseJsonArray(formData.get("specifications")),
  );
  const rawVariants = parseJsonArray(formData.get("variants")) as Array<{
    name?: string;
    price?: number | string;
    description?: string;
  }>;
  const variants = rawVariants
    .map((variant) => ({
      name: String(variant.name ?? "").trim(),
      price: parseMoney(variant.price ?? 0),
      description: String(variant.description ?? "").trim(),
    }))
    .filter((variant) => variant.name.length > 0);
  const defaultVariants = [
    { name: "AAAAA Clone", price: basePrice, description: "" },
    { name: "1:1 Clone", price: basePrice, description: "" },
    { name: "Top 1:1 Clone", price: basePrice, description: "" },
  ];
  const seededVariants = variants.length > 0 ? variants : defaultVariants;
  const uniqueVariantPrices = new Set(seededVariants.map((variant) => variant.price));
  // If every version shares one price (including all 0), apply Base price to all.
  // If versions already have different prices, keep them and only fill zeros from Base.
  const resolvedVariants =
    uniqueVariantPrices.size <= 1
      ? seededVariants.map((variant) => ({ ...variant, price: basePrice }))
      : seededVariants.map((variant) => ({
          ...variant,
          price: variant.price > 0 ? variant.price : basePrice,
        }));
  const resolvedPrice = basePrice;

  const rawFaq = parseJsonArray(formData.get("faq")) as Array<{
    question?: string;
    answer?: string;
  }>;
  const faq = rawFaq
    .map((item) => ({
      question: String(item.question ?? "").trim(),
      answer: String(item.answer ?? "").trim(),
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0);

  const rawReviews = parseJsonArray(formData.get("reviews")) as Array<{
    id?: string;
    author?: string;
    rating?: number;
    title?: string;
    body?: string;
    date?: string;
  }>;
  const reviews = rawReviews
    .map((item, index) => {
      const rating = Number(item.rating);
      return {
        id: String(item.id ?? "").trim() || `review-${index + 1}`,
        author: String(item.author ?? "").trim(),
        rating: Number.isFinite(rating)
          ? Math.min(5, Math.max(1, Math.round(rating)))
          : 5,
        title: String(item.title ?? "").trim(),
        body: String(item.body ?? "").trim(),
        date: String(item.date ?? "").trim() || new Date().toISOString().slice(0, 10),
      };
    })
    .filter((item) => item.author.length > 0 && item.body.length > 0);

  if (!title) {
    throw new Error("Title is required.");
  }

  const collection_id = String(formData.get("collection_id") ?? "").trim();
  const collection_name = String(formData.get("collection_name") ?? "").trim();
  const collection_slug = String(formData.get("collection_slug") ?? "").trim();

  if (!collection_id || !collection_name || !collection_slug) {
    throw new Error("Please choose a collection.");
  }

  const slug = slugify(slugInput || title);
  const aboutDescription = sanitizeAboutHtml(
    String(formData.get("about_description") ?? ""),
  );
  const payload = {
    title,
    slug,
    short_description: "",
    description: aboutDescription,
    price: resolvedPrice,
    compare_at_price,
    currency: String(formData.get("currency") ?? "USD"),
    collection_id,
    collection_name,
    collection_slug,
    gender: String(formData.get("gender") ?? "unisex"),
    movement: String(formData.get("movement") ?? "automatic"),
    style: String(formData.get("style") ?? "sport"),
    stock: String(formData.get("stock") ?? "in_stock"),
    is_new_arrival: formData.get("is_new_arrival") === "on",
    is_best_seller: formData.get("is_best_seller") === "on",
    images,
    description_image,
    specification_details: specifications,
    variants: resolvedVariants,
    features,
    about: {
      title: String(formData.get("about_title") ?? title),
      description: aboutDescription,
      image: description_image ?? {
        url: "/images/placeholders/watch-placeholder.svg",
        alt: title,
        width: 800,
        height: 800,
      },
    },
    faq,
    reviews,
    seo_title: String(formData.get("seo_title") ?? "") || null,
    seo_description: String(formData.get("seo_description") ?? "") || null,
    status,
    published_at:
      status === "published" ? new Date().toISOString() : null,
  };

  async function writeProduct(fullPayload: typeof payload) {
    if (id) {
      let { error } = await supabase
        .from("cms_products")
        .update(fullPayload)
        .eq("id", id);

      if (error && /description_image/i.test(error.message)) {
        const legacyPayload = omitKey(fullPayload, "description_image");
        ({ error } = await supabase
          .from("cms_products")
          .update(legacyPayload)
          .eq("id", id));
      }

      if (error) {
        throw new Error(error.message);
      }

      return id;
    }

    let insertResult = await supabase
      .from("cms_products")
      .insert(fullPayload)
      .select("id")
      .single();

    if (
      insertResult.error &&
      /description_image/i.test(insertResult.error.message)
    ) {
      const legacyPayload = omitKey(fullPayload, "description_image");
      insertResult = await supabase
        .from("cms_products")
        .insert(legacyPayload)
        .select("id")
        .single();
    }

    if (insertResult.error) {
      throw new Error(insertResult.error.message);
    }

    return insertResult.data.id as string;
  }

  const savedId = await writeProduct(payload);

  revalidatePath("/", "layout");
  revalidatePath("/shop", "page");
  revalidatePath(`/products/${slug}`, "page");
  revalidatePath("/admin/products");
  if (collection_slug) {
    revalidatePath(`/collections/${collection_slug}`, "page");
    revalidatePath(`/new-arrival-collections/${collection_slug}`, "page");
  }
  redirect(`/admin/products/${savedId}?saved=1`);
}

export async function deleteProductAction(formData: FormData) {
  const { supabase } = await requireAdminDb();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("cms_products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function saveArticleAction(formData: FormData) {
  const { supabase } = await requireAdminDb();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const status = statusSchema.parse(String(formData.get("status") ?? "draft"));
  const type = articleTypeSchema.parse(String(formData.get("type") ?? "blog"));
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content_blocks = parseAndSanitizeArticleBlocks(
    formData.get("content_blocks"),
    status,
  );
  const content = serializeArticleContent(content_blocks);
  const coverRaw = String(formData.get("cover_image") ?? "");
  let cover_image: CmsArticleRecord["cover_image"] = null;

  if (coverRaw.trim()) {
    try {
      const parsedCover = articleImageSchema.safeParse(JSON.parse(coverRaw));
      if (!parsedCover.success) {
        throw new Error("Invalid cover image data.");
      }
      cover_image = parsedCover.data;
    } catch {
      throw new Error("Invalid cover image data.");
    }
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  const slug = slugify(slugInput || title);
  if (!slug) {
    throw new Error("Enter a title or valid slug.");
  }
  if (!excerpt) {
    throw new Error("Short summary is required.");
  }
  if (status === "published") {
    if (
      !cover_image?.url ||
      !cover_image.alt?.trim() ||
      cover_image.width <= 0 ||
      cover_image.height <= 0
    ) {
      throw new Error(
        "A cover image with descriptive alt text, width, and height is required before publishing.",
      );
    }
  }

  type PreviousArticle = Pick<
    CmsArticleRecord,
    "published_at" | "slug" | "status" | "type"
  >;
  let previous: PreviousArticle | null = null;
  if (id) {
    const { data, error } = await supabase
      .from("cms_articles")
      .select("published_at, slug, status, type")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    previous = data as PreviousArticle | null;
  }

  const payload = {
    title,
    slug,
    excerpt,
    content,
    content_blocks,
    cover_image,
    category: String(formData.get("category") ?? "company"),
    type,
    status,
    seo_title: String(formData.get("seo_title") ?? "").trim() || null,
    seo_description:
      String(formData.get("seo_description") ?? "").trim() || null,
    published_at:
      status === "published"
        ? previous?.status === "published" && previous.published_at
          ? previous.published_at
          : new Date().toISOString()
        : null,
  };

  if (id) {
    let { error } = await supabase
      .from("cms_articles")
      .update(payload)
      .eq("id", id);
    if (error && /content_blocks/i.test(error.message)) {
      const legacyPayload = omitKey(payload, "content_blocks");
      ({ error } = await supabase
        .from("cms_articles")
        .update(legacyPayload)
        .eq("id", id));
    }
    if (error) {
      throw new Error(error.message);
    }
    revalidateArticlePaths(type, slug);
    if (previous && (previous.slug !== slug || previous.type !== type)) {
      revalidateArticlePaths(previous.type, previous.slug);
    }
    redirect(`/admin/blogs/${id}?saved=1`);
  }

  let { data, error } = await supabase
    .from("cms_articles")
    .insert(payload)
    .select("id")
    .single();
  if (error && /content_blocks/i.test(error.message)) {
    const legacyPayload = omitKey(payload, "content_blocks");
    ({ data, error } = await supabase
      .from("cms_articles")
      .insert(legacyPayload)
      .select("id")
      .single());
  }

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("Article was saved but no record was returned.");
  }

  revalidateArticlePaths(type, slug);
  redirect(`/admin/blogs/${data.id}?saved=1`);
}

export async function deleteArticleAction(formData: FormData) {
  const { supabase } = await requireAdminDb();
  const id = String(formData.get("id") ?? "");

  const { data: existing, error: readError } = await supabase
    .from("cms_articles")
    .select("slug, type")
    .eq("id", id)
    .maybeSingle();
  if (readError) {
    throw new Error(readError.message);
  }

  const { error } = await supabase.from("cms_articles").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/guides");
  revalidatePath("/sitemap.xml");
  if (existing?.slug && existing?.type) {
    revalidatePath(
      `/${existing.type === "guide" ? "guides" : "blog"}/${existing.slug}`,
    );
  }
  redirect("/admin/blogs");
}

function revalidateArticlePaths(type: string, slug: string) {
  revalidatePath("/admin/blogs");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/guides");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/${type === "guide" ? "guides" : "blog"}/${slug}`);
}

export async function uploadAdminImageAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file uploaded." };
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { error: "File too large (max 5MB)." };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { error: "Unsupported file type." };
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const extension = extensionByType[file.type];
  const path = `admin/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const sharp = (await import("sharp")).default;
    const metadata = await sharp(buffer, { animated: false }).metadata();
    if (!metadata.width || !metadata.height) {
      return { error: "Could not determine image dimensions." };
    }

    const { createServiceRoleSupabaseClient } = await import(
      "@/lib/supabase/service-role"
    );
    const supabase = createServiceRoleSupabaseClient();

    const { error } = await supabase.storage
      .from("website-media")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return { error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("website-media").getPublicUrl(path);

    return {
      url: publicUrl,
      alt: "",
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Upload failed. Check SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    };
  }
}
