import type { ProductImage } from "@/types/product";

export type ArticleType = "blog" | "guide" | "pillar" | "cluster";

export type PublicationStatus = "draft" | "published" | "archived";

export type ArticleCategory =
  | "buying-guide"
  | "watch-care"
  | "style"
  | "education"
  | "company";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image?: ProductImage;
  category: ArticleCategory;
  type: ArticleType;
  status: PublicationStatus;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
