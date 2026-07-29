export type CurrencyCode = "USD" | "EUR" | "GBP" | "AED";

export type ProductGender = "men" | "women" | "unisex";

export type WatchMovement = "automatic" | "quartz" | "mechanical" | "solar";

export type WatchStyle =
  | "dress"
  | "dive"
  | "field"
  | "pilot"
  | "sport"
  | "minimal";

export type StockStatus = "in_stock" | "out_of_stock" | "preorder";

export type ProductImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
  objectClassName?: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductVariant = {
  name: string;
  price: number;
  description: string;
};

export type ProductSpecifications = {
  movement: string;
  caseSize: string;
  caseMaterial: string;
  caseThickness: string;
  crystal: string;
  dialColor: string;
  strap: string;
  strapWidth: string;
  waterResistance: string;
  powerReserve: string;
};

export type ProductAbout = {
  title: string;
  description: string;
  image: ProductImage;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type ProductFaqItem = {
  question: string;
  answer: string;
};

export type ProductCollectionReference = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: CurrencyCode;
  images: ProductImage[];
  collectionId: string;
  collection: ProductCollectionReference;
  gender: ProductGender;
  movement: WatchMovement;
  style: WatchStyle;
  specifications: ProductSpecification[];
  specificationDetails: ProductSpecifications;
  variants: ProductVariant[];
  features: string[];
  about: ProductAbout;
  reviews: ProductReview[];
  faq: ProductFaqItem[];
  stock: StockStatus;
  isNewArrival: boolean;
  isBestSeller: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
