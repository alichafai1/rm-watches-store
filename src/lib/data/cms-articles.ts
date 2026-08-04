import { cache } from "react";
import { hasUsableCmsEnv } from "@/lib/supabase/env";
import { createCmsReadSupabaseClients } from "@/lib/supabase/server";
import { extractEmbeddedArticleBlocks } from "@/lib/utils/article-html";
import type { Article } from "@/types/article";
import type { CmsArticleRecord } from "@/types/cms";

/** Fields needed for cards, indexes, sitemap, and related links. */
const ARTICLE_LIST_COLUMNS =
  "id, slug, title, excerpt, cover_image, category, type, status, seo_title, seo_description, published_at, created_at, updated_at";

/** Detail without legacy `content` — avoids downloading duplicated HTML + base64. */
const ARTICLE_DETAIL_COLUMNS = `${ARTICLE_LIST_COLUMNS}, content_blocks`;

type CmsArticleListRecord = Omit<CmsArticleRecord, "content" | "content_blocks">;

export function mapCmsArticleToArticle(
  record: CmsArticleRecord | CmsArticleListRecord,
): Article {
  const content = "content" in record ? (record.content ?? "") : "";
  const contentBlocks =
    "content_blocks" in record && record.content_blocks?.length
      ? record.content_blocks
      : content
        ? extractEmbeddedArticleBlocks(content)
        : undefined;

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content,
    contentBlocks,
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

async function fetchPublishedCmsArticles(): Promise<Article[]> {
  if (!hasUsableCmsEnv()) return [];

  try {
    let lastError: string | null = null;
    for (const supabase of createCmsReadSupabaseClients()) {
      const { data, error } = await supabase
        .from("cms_articles")
        .select(ARTICLE_LIST_COLUMNS)
        .eq("status", "published")
        .in("type", ["blog", "guide"])
        .order("published_at", { ascending: false });

      if (!error) {
        return (
          (data as CmsArticleListRecord[] | null)?.map(mapCmsArticleToArticle) ??
          []
        );
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

/** Dedupes list fetches within a single request (home, blog index, related). */
export const getPublishedCmsArticles = cache(fetchPublishedCmsArticles);

async function fetchPublishedCmsArticleBySlug(
  slug: string,
): Promise<Article | null> {
  if (!hasUsableCmsEnv()) return null;

  try {
    let lastError: string | null = null;
    for (const supabase of createCmsReadSupabaseClients()) {
      let { data, error } = await supabase
        .from("cms_articles")
        .select(ARTICLE_DETAIL_COLUMNS)
        .eq("status", "published")
        .eq("slug", slug)
        .in("type", ["blog", "guide"])
        .maybeSingle();

      // Older DBs without content_blocks fall back to the full content column.
      if (error && /content_blocks/i.test(error.message)) {
        ({ data, error } = await supabase
          .from("cms_articles")
          .select(`${ARTICLE_LIST_COLUMNS}, content`)
          .eq("status", "published")
          .eq("slug", slug)
          .in("type", ["blog", "guide"])
          .maybeSingle());
      }

      if (!error) {
        if (!data) return null;
        const record = data as CmsArticleRecord;
        if (record.content_blocks?.length) {
          return mapCmsArticleToArticle({ ...record, content: "" });
        }

        // Structured column empty — load legacy HTML only when needed.
        if (!record.content) {
          const { data: legacy, error: legacyError } = await supabase
            .from("cms_articles")
            .select("content")
            .eq("status", "published")
            .eq("slug", slug)
            .maybeSingle();
          if (legacyError) {
            lastError = legacyError.message;
            continue;
          }
          return mapCmsArticleToArticle({
            ...record,
            content: (legacy as { content?: string } | null)?.content ?? "",
          });
        }

        return mapCmsArticleToArticle(record);
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

export const getPublishedCmsArticleBySlug = cache(fetchPublishedCmsArticleBySlug);
