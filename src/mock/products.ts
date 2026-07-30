import { mockCollections } from "@/mock/collections";
import type { Product, ProductCollectionReference } from "@/types/product";

const placeholderImage = {
  url: "/images/placeholders/watch-placeholder.svg",
  alt: "Neutral watch placeholder image",
  width: 800,
  height: 800,
};

const defaultFeatures = [
  "Reliable watch movement",
  "Clean crystal presentation",
  "Durable case construction",
  "Comfortable strap design",
  "Everyday water resistance",
  "Date display placeholder",
];

const defaultReviews = [
  {
    id: "review-001",
    author: "Reviewer One",
    rating: 5,
    title: "Review placeholder",
    body: "This placeholder review area is ready for real customer feedback later.",
    date: "2026-01-01",
  },
  {
    id: "review-002",
    author: "Reviewer Two",
    rating: 4,
    title: "Clean presentation",
    body: "Temporary review content for validating the product page layout.",
    date: "2026-01-02",
  },
  {
    id: "review-003",
    author: "Reviewer Three",
    rating: 5,
    title: "Ready for real data",
    body: "This card will be replaced once verified customer reviews are connected.",
    date: "2026-01-03",
  },
];

const defaultFaq = [
  {
    question: "What is the warranty?",
    answer: "This placeholder answer will be replaced with final warranty details.",
  },
  {
    question: "How does shipping work?",
    answer: "This placeholder answer will be replaced with final shipping details.",
  },
  {
    question: "Can I return this watch?",
    answer: "This placeholder answer will be replaced with final return details.",
  },
  {
    question: "Is this watch water resistant?",
    answer:
      "This placeholder answer will be replaced with the final water resistance guidance.",
  },
];

function createProductPageData(
  title: string,
  price: number,
  specificationDetails: Product["specificationDetails"],
): Pick<
  Product,
  "about" | "faq" | "features" | "reviews" | "specificationDetails" | "variants"
> {
  return {
    variants: [
      {
        name: "Standard",
        price,
        description: "Everyday quality",
      },
      {
        name: "Super Clone",
        price: price + 80,
        description: "Premium quality",
      },
    ],
    specificationDetails,
    features: defaultFeatures,
    about: {
      title: "About This Watch",
      description: `${title} placeholder content for future SEO-friendly product storytelling, covering style, daily use, materials, and buying guidance.`,
      image: {
        ...placeholderImage,
        alt: `${title} about section placeholder image`,
      },
    },
    reviews: defaultReviews,
    faq: defaultFaq,
  };
}

function createCollectionReference(collectionNumber: number): ProductCollectionReference {
  const collection = mockCollections.find(
    (item) => item.id === String(collectionNumber),
  );

  return {
    id: String(collectionNumber),
    name: collection?.name ?? `Collection ${collectionNumber}`,
    slug: collection?.slug ?? `collection-${collectionNumber}`,
  };
}

function createMockProduct(productNumber: number): Product {
  const collectionNumber = Math.ceil(productNumber / 2);
  const collection = createCollectionReference(collectionNumber);
  const title = `Product ${productNumber}`;
  const price = 180 + productNumber * 5;
  const movement = productNumber % 2 === 0 ? "quartz" : "automatic";
  const gender =
    productNumber % 3 === 0
      ? "women"
      : productNumber % 3 === 1
        ? "men"
        : "unisex";
  const style = productNumber % 2 === 0 ? "dress" : "minimal";

  return {
    id: `product-${productNumber}`,
    slug: `product-${productNumber}`,
    title,
    description:
      "Temporary product content used until real catalog data is connected.",
    price,
    compareAtPrice: productNumber % 2 === 0 ? price + 40 : undefined,
    currency: "USD",
    images: [
      {
        ...placeholderImage,
        alt: `${title} main placeholder image`,
      },
      {
        ...placeholderImage,
        alt: `${title} side placeholder image`,
      },
      {
        ...placeholderImage,
        alt: `${title} strap placeholder image`,
      },
      {
        ...placeholderImage,
        alt: `${title} case placeholder image`,
      },
    ],
    collectionId: collection.id,
    collection,
    gender,
    movement,
    style,
    specifications: [
      { label: "Case size", value: `${36 + (productNumber % 7)} mm` },
      {
        label: "Movement",
        value: movement === "automatic" ? "Automatic" : "Quartz",
      },
    ],
    ...createProductPageData(title, price, {
      movement: movement === "automatic" ? "Automatic" : "Quartz",
      caseSize: `${36 + (productNumber % 7)} mm`,
      caseMaterial: "Stainless steel placeholder",
      caseThickness: `${8 + (productNumber % 6)} mm`,
      crystal: "Mineral crystal placeholder",
      dialColor: productNumber % 2 === 0 ? "White" : "Black",
      strap:
        productNumber % 2 === 0
          ? "Leather strap placeholder"
          : "Bracelet strap placeholder",
      strapWidth: `${18 + (productNumber % 5)} mm`,
      waterResistance: "50 m placeholder",
      powerReserve:
        movement === "automatic"
          ? "40 hours placeholder"
          : "Battery powered placeholder",
    }),
    stock: "in_stock",
    isNewArrival: productNumber <= 8,
    isBestSeller: productNumber % 2 === 0,
    seoTitle: title,
    seoDescription: `${title} placeholder product page for the watch ecommerce foundation.`,
  };
}

export const mockProducts: Product[] = Array.from({ length: 40 }, (_, index) =>
  createMockProduct(index + 1),
);
