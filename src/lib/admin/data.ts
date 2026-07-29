import { requireAdminDb } from "@/lib/auth/admin";
import type { CmsArticleRecord, CmsProductRecord } from "@/types/cms";

export async function listAdminProducts() {
  const { supabase } = await requireAdminDb();
  const { data, error } = await supabase
    .from("cms_products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CmsProductRecord[];
}

export async function getAdminProduct(id: string) {
  const { supabase } = await requireAdminDb();
  const { data, error } = await supabase
    .from("cms_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CmsProductRecord | null;
}

export async function listAdminArticles(type?: string) {
  const { supabase } = await requireAdminDb();
  let query = supabase
    .from("cms_articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CmsArticleRecord[];
}

export async function getAdminArticle(id: string) {
  const { supabase } = await requireAdminDb();
  const { data, error } = await supabase
    .from("cms_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CmsArticleRecord | null;
}

export async function getAdminCounts() {
  const { supabase } = await requireAdminDb();

  const [products, articles] = await Promise.all([
    supabase.from("cms_products").select("id, status"),
    supabase.from("cms_articles").select("id, status, type"),
  ]);

  if (products.error) {
    throw new Error(products.error.message);
  }
  if (articles.error) {
    throw new Error(articles.error.message);
  }

  const productRows = products.data ?? [];
  const articleRows = articles.data ?? [];

  return {
    productsTotal: productRows.length,
    productsDraft: productRows.filter((row) => row.status === "draft").length,
    productsPublished: productRows.filter((row) => row.status === "published")
      .length,
    blogsTotal: articleRows.filter((row) => row.type === "blog").length,
    blogsDraft: articleRows.filter(
      (row) => row.type === "blog" && row.status === "draft",
    ).length,
    blogsPublished: articleRows.filter(
      (row) => row.type === "blog" && row.status === "published",
    ).length,
  };
}
