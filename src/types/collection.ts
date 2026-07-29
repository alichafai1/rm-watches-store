import type { FaqItem } from "@/types/faq";
import type { ProductImage } from "@/types/product";

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  about?: string;
  image?: ProductImage;
  faq?: FaqItem[];
  seoTitle?: string;
  seoDescription?: string;
};
