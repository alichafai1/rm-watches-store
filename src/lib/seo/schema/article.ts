import type { Article } from "@/types/article";
import type { JsonLdObject } from "@/types/seo";
import { siteConfig } from "@/constants/site";

export function createArticleSchema(article: Article, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": article.type === "guide" ? "TechArticle" : "Article",
    headline: article.title,
    description: article.excerpt,
    url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: article.image?.url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}
