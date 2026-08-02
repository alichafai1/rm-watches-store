import { hasUsableCmsEnv } from "@/lib/supabase/env";
import { createCmsReadSupabaseClients } from "@/lib/supabase/server";
import type { Article } from "@/types/article";
import type { CmsArticleRecord } from "@/types/cms";

export function mapCmsArticleToArticle(record: CmsArticleRecord): Article {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
    image: record.cover_image ?? undefined,
    category: record.category,
    type: record.type,
    status: record.status,
    publishedAt: record.published_at ?? undefined,
    updatedAt: record.updated_at,
    seoTitle: record.seo_title ?? undefined,
    seoDescription: record.seo_description ?? undefined,
  };
}

export async function getPublishedCmsArticles(): Promise<Article[]> {
  if (!hasUsableCmsEnv()) return [];

  try {
    let lastError: string | null = null;
    for (const supabase of createCmsReadSupabaseClients()) {
      const { data, error } = await supabase
        .from("cms_articles")
        .select("*")
        .eq("status", "published")
        .in("type", ["blog", "guide"])
        .order("published_at", { ascending: false });

      if (!error) {
        return (data as CmsArticleRecord[] | null)?.map(mapCmsArticleToArticle) ?? [];
      }
      lastError = error.message;
    }
    if (lastError) {
      console.error("[cms_articles] Failed to load published articles:", lastError);
    }
  } catch (error) {
    console.error("[cms_articles] Unexpected article loading error:", error);
  }
  return [];
}

export async function getPublishedCmsArticleBySlug(
  slug: string,
): Promise<Article | null> {
  if (!hasUsableCmsEnv()) return null;

  try {
    let lastError: string | null = null;
    for (const supabase of createCmsReadSupabaseClients()) {
      const { data, error } = await supabase
        .from("cms_articles")
        .select("*")
        .eq("status", "published")
        .eq("slug", slug)
        .in("type", ["blog", "guide"])
        .maybeSingle();

      if (!error) {
        return data
          ? mapCmsArticleToArticle(data as CmsArticleRecord)
          : null;
      }
      lastError = error.message;
    }
    if (lastError) {
      console.error(`[cms_articles] Failed to load "${slug}":`, lastError);
    }
  } catch (error) {
    console.error(`[cms_articles] Unexpected error loading "${slug}":`, error);
  }
  return null;
}
