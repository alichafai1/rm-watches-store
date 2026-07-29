import type { Article } from "@/types/article";
import type { JsonLdObject } from "@/types/seo";

export function createArticleSchema(article: Article, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": article.type === "guide" ? "TechArticle" : "Article",
    headline: article.title,
    description: article.excerpt,
    url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
  };
}
