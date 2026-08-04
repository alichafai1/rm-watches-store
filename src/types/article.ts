import type { ProductImage } from "@/types/product";

export type ArticleType = "blog" | "guide" | "pillar" | "cluster";

export type PublicationStatus = "draft" | "published" | "archived";

export type ArticleCategory =
  | "buying-guide"
  | "watch-care"
  | "style"
  | "education"
  | "company";

type ArticleContentBlockBase = {
  id: string;
};

export type ArticleHeadingBlock = ArticleContentBlockBase & {
  type: "heading";
  level: 2 | 3;
  text: string;
};

export type ArticleParagraphBlock = ArticleContentBlockBase & {
  type: "paragraph";
  /** Sanitized inline HTML (strong, em, and links only). */
  html: string;
};

export type ArticleListBlock = ArticleContentBlockBase & {
  type: "list";
  style: "bullet" | "ordered";
  items: string[];
};

export type ArticleQuoteBlock = ArticleContentBlockBase & {
  type: "quote";
  html: string;
};

export type ArticleImageBlock = ArticleContentBlockBase & {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type ArticleContentBlock =
  | ArticleHeadingBlock
  | ArticleParagraphBlock
  | ArticleListBlock
  | ArticleQuoteBlock
  | ArticleImageBlock;

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentBlocks?: ArticleContentBlock[];
  image?: ProductImage;
  category: ArticleCategory;
  type: ArticleType;
  status: PublicationStatus;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
