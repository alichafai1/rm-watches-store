import type { FaqItem } from "@/types/faq";

export function createDefaultCollectionFaq(collectionName: string): FaqItem[] {
  return [
    {
      question: `What makes the ${collectionName} collection unique?`,
      answer: `The ${collectionName} collection is curated around a distinct design language, materials, and wearing style. This placeholder answer will be replaced with collection-specific SEO content.`,
    },
    {
      question: `How should I choose a watch from the ${collectionName} collection?`,
      answer: `Compare case size, dial style, strap options, and daily use needs within the ${collectionName} collection. This placeholder answer will be replaced with buying guidance for this collection.`,
    },
    {
      question: `What should I know before buying from the ${collectionName} collection?`,
      answer: `Review the product details, materials, and available variants in the ${collectionName} collection before purchasing. This placeholder answer will be replaced with final collection FAQ content.`,
    },
  ];
}
