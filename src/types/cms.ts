import type { ArticleCategory, ArticleType, PublicationStatus } from "@/types/article";
import type {
  CurrencyCode,
  ProductAbout,
  ProductFaqItem,
  ProductGender,
  ProductImage,
  ProductReview,
  ProductSpecification,
  ProductVariant,
  StockStatus,
  WatchMovement,
  WatchStyle,
} from "@/types/product";

export type CmsStatus = PublicationStatus;

export type CmsProductRecord = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: CurrencyCode;
  collection_id: string;
  collection_name: string;
  collection_slug: string;
  gender: ProductGender;
  movement: WatchMovement;
  style: WatchStyle;
  stock: StockStatus;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  images: ProductImage[];
  /** Image shown in the product description / about section. */
  description_image?: ProductImage | null;
  specification_details: ProductSpecification[] | Record<string, string>;
  variants: ProductVariant[];
  features: string[];
  about: ProductAbout;
  reviews: ProductReview[];
  faq: ProductFaqItem[];
  seo_title: string | null;
  seo_description: string | null;
  status: CmsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsArticleRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: ProductImage | null;
  category: ArticleCategory;
  type: ArticleType;
  status: CmsStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
