"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireAdminDb } from "@/lib/auth/admin";
import { parseSpecificationRows } from "@/lib/utils/specifications";
import type { CmsArticleRecord, CmsProductRecord } from "@/types/cms";

const statusSchema = z.enum(["draft", "published", "archived"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

  if (error || !data.user || !isAdminUser(data.user)) {
    if (data.user && !isAdminUser(data.user)) {
      await supabase.auth.signOut();
    }
    redirect(`/admin/login?error=invalid`);
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

export async function saveProductAction(formData: FormData) {
  const { supabase } = await requireAdminDb();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const status = statusSchema.parse(String(formData.get("status") ?? "draft"));
  const price = Number(formData.get("price") ?? 0);
  const compareAtRaw = String(formData.get("compare_at_price") ?? "").trim();
  const compareAtParsed = compareAtRaw === "" ? null : Number(compareAtRaw);
  const compare_at_price =
    compareAtParsed !== null && Number.isFinite(compareAtParsed)
      ? compareAtParsed
      : null;
  const images = parseJsonArray(formData.get("images")) as CmsProductRecord["images"];
  const features = parseLines(formData.get("features"));
  const specifications = parseSpecificationRows(
    parseJsonArray(formData.get("specifications")),
  );
  const rawVariants = parseJsonArray(formData.get("variants")) as Array<{
    name?: string;
    price?: number;
    description?: string;
  }>;
  const variants = rawVariants
    .map((variant) => ({
      name: String(variant.name ?? "").trim(),
      price: Number(variant.price),
      description: String(variant.description ?? "").trim(),
    }))
    .filter((variant) => variant.name.length > 0)
    .map((variant) => ({
      ...variant,
      price: Number.isFinite(variant.price) ? variant.price : 0,
    }));
  const baseVariantPrice = Number.isFinite(price) ? price : 0;
  const resolvedVariants =
    variants.length > 0
      ? variants
      : [
          { name: "AAAAA Clone", price: baseVariantPrice, description: "" },
          { name: "1:1 Clone", price: baseVariantPrice, description: "" },
          { name: "Top 1:1 Clone", price: baseVariantPrice, description: "" },
        ];
  const resolvedPrice = resolvedVariants[0]?.price ?? (Number.isFinite(price) ? price : 0);

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
  const payload = {
    title,
    slug,
    short_description: "",
    description: String(formData.get("about_description") ?? ""),
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
    specification_details: specifications,
    variants: resolvedVariants,
    features,
    about: {
      title: String(formData.get("about_title") ?? title),
      description: String(formData.get("about_description") ?? ""),
      image: images[0] ?? {
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

  if (id) {
    const { error } = await supabase
      .from("cms_products")
      .update(payload)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/products/${slug}`);
    if (collection_slug) {
      revalidatePath(`/collections/${collection_slug}`);
      revalidatePath(`/new-arrival-collections/${collection_slug}`);
    }
    redirect(`/admin/products/${id}?saved=1`);
  }

  const { data, error } = await supabase
    .from("cms_products")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/products/${slug}`);
  if (collection_slug) {
    revalidatePath(`/collections/${collection_slug}`);
    revalidatePath(`/new-arrival-collections/${collection_slug}`);
  }
  redirect(`/admin/products/${data.id}?saved=1`);
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
  const coverRaw = String(formData.get("cover_image") ?? "");
  let cover_image: CmsArticleRecord["cover_image"] = null;

  if (coverRaw.trim()) {
    try {
      cover_image = JSON.parse(coverRaw) as CmsArticleRecord["cover_image"];
    } catch {
      cover_image = null;
    }
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  const slug = slugify(slugInput || title);
  const payload = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    cover_image,
    category: String(formData.get("category") ?? "company"),
    type: String(formData.get("type") ?? "blog"),
    status,
    seo_title: String(formData.get("seo_title") ?? "") || null,
    seo_description: String(formData.get("seo_description") ?? "") || null,
    published_at:
      status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await supabase
      .from("cms_articles")
      .update(payload)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/admin/blogs");
    redirect(`/admin/blogs/${id}?saved=1`);
  }

  const { data, error } = await supabase
    .from("cms_articles")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blogs");
  redirect(`/admin/blogs/${data.id}?saved=1`);
}

export async function deleteArticleAction(formData: FormData) {
  const { supabase } = await requireAdminDb();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("cms_articles").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
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

  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `admin/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
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
      width: 1024,
      height: 1024,
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
