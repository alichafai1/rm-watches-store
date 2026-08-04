import type { Article } from "@/types/article";
import type { JsonLdObject } from "@/types/seo";
import { siteConfig } from "@/constants/site";
import { absoluteUrl } from "@/lib/seo/urls";
import { articleHtmlToPlainText } from "@/lib/utils/article-html";

function articlePlainText(article: Article) {
  if (!article.contentBlocks) {
    return articleHtmlToPlainText(article.content);
  }

  return article.contentBlocks
    .flatMap((block) => {
      switch (block.type) {
        case "heading":
          return block.text;
        case "paragraph":
        case "quote":
          return articleHtmlToPlainText(block.html);
        case "list":
          return block.items.map(articleHtmlToPlainText);
        case "image":
          return block.caption ?? "";
      }
    })
    .flat()
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function articleImages(article: Article) {
  const urls = [
    article.image?.url,
    ...(article.contentBlocks ?? [])
      .filter((block) => block.type === "image")
      .map((block) => block.url),
  ].filter((value): value is string => Boolean(value));

  return [...new Set(urls.map(absoluteUrl))];
}

export function createArticleSchema(article: Article, url: string): JsonLdObject {
  const text = articlePlainText(article);
  const images = articleImages(article);
  const organization = {
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  };

  return {
    "@context": "https://schema.org",
    "@type": article.type === "guide" ? "TechArticle" : "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: images.length > 0 ? images : undefined,
    mainEntityOfPage: url,
    wordCount: text ? text.split(/\s+/u).length : 0,
    author: organization,
    publisher: organization,
  };
}
