import type { FaqItem } from "@/types/faq";
import type { ProductImage } from "@/types/product";

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  cardDescription?: string;
  about?: string;
  image?: ProductImage;
  faq?: FaqItem[];
  seoTitle?: string;
  seoDescription?: string;
};
