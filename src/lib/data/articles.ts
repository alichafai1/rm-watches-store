import { mockArticles } from "@/mock/articles";
import type { ArticleType } from "@/types/article";

export function getArticles() {
  return mockArticles;
}

export function getArticleBySlug(slug: string) {
  return mockArticles.find((article) => article.slug === slug);
}

export function getArticlesByType(type: ArticleType) {
  return mockArticles.filter((article) => article.type === type);
}

export function getFeaturedGuide() {
  return mockArticles.find(
    (article) => article.type === "guide" && article.slug === "how-to-choose-a-watch",
  );
}

export function getLatestArticles(limit = 3) {
  return mockArticles
    .filter((article) => article.type === "blog" && article.status === "published")
    .slice(0, limit);
}
