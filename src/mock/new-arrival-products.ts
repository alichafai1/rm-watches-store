import { mockNewArrivalCollections } from "@/mock/new-arrival-collections";
import type {
  Product,
  ProductCollectionReference,
  ProductSpecifications,
} from "@/types/product";

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
  specificationDetails: ProductSpecifications,
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

function createNewArrivalCollectionReference(
  collectionNumber: number,
): ProductCollectionReference {
  const collection = mockNewArrivalCollections[collectionNumber - 1];

  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
  };
}

function createNewArrivalMockProduct(
  collectionNumber: number,
  productIndex: 1 | 2,
): Product {
  const productNumber = (collectionNumber - 1) * 2 + productIndex;
  const collection = createNewArrivalCollectionReference(collectionNumber);
  const title = `${collection.name} Product ${productIndex}`;
  const price = 190 + productNumber * 5;
  const movement = productNumber % 2 === 0 ? "quartz" : "automatic";
  const gender =
    productNumber % 3 === 0
      ? "women"
      : productNumber % 3 === 1
        ? "men"
        : "unisex";
  const style = productNumber % 2 === 0 ? "sport" : "minimal";

  return {
    id: `na-product-${collectionNumber}-${productIndex}`,
    slug: `new-arrival-${collectionNumber}-product-${productIndex}`,
    title,
    description:
      "Temporary product content used until real catalog data is connected.",
    price,
    compareAtPrice: productIndex % 2 === 0 ? price + 50 : undefined,
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
    isNewArrival: true,
    isBestSeller: false,
    seoTitle: title,
    seoDescription: `${title} placeholder product page for the new arrival collection system.`,
  };
}

export const mockNewArrivalProducts: Product[] = mockNewArrivalCollections.flatMap(
  (_, index) => {
    const collectionNumber = index + 1;

    return [
      createNewArrivalMockProduct(collectionNumber, 1),
      createNewArrivalMockProduct(collectionNumber, 2),
    ];
  },
);
