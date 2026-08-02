import { mockArticles } from "@/mock/articles";
import {
  getPublishedCmsArticleBySlug,
  getPublishedCmsArticles,
} from "@/lib/data/cms-articles";
import type { ArticleType } from "@/types/article";

function publishedMockArticles() {
  return mockArticles.filter((article) => article.status === "published");
}

function sortNewestFirst<T extends { publishedAt?: string }>(articles: T[]) {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt ?? 0).getTime() -
      new Date(a.publishedAt ?? 0).getTime(),
  );
}

export async function getArticles() {
  const cmsArticles = await getPublishedCmsArticles();
  return sortNewestFirst(
    cmsArticles.length > 0 ? cmsArticles : publishedMockArticles(),
  );
}

export async function getArticleBySlug(slug: string) {
  const cmsArticle = await getPublishedCmsArticleBySlug(slug);
  if (cmsArticle) return cmsArticle;

  return publishedMockArticles().find((article) => article.slug === slug);
}

export async function getArticlesByType(type: ArticleType) {
  const cmsArticles = (await getPublishedCmsArticles()).filter(
    (article) => article.type === type,
  );
  const fallback = publishedMockArticles().filter(
    (article) => article.type === type,
  );
  return sortNewestFirst(cmsArticles.length > 0 ? cmsArticles : fallback);
}

export async function getFeaturedGuide() {
  return (await getArticlesByType("guide"))[0];
}

export async function getLatestArticles(limit = 3) {
  return (await getArticlesByType("blog")).slice(0, limit);
}
