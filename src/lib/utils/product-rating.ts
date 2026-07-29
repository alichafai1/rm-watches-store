import type { ProductReview } from "@/types/product";

export type ProductRatingSummary = {
  /** Average rounded to nearest 0.5 for star display (e.g. 4.5). */
  average: number;
  /** Exact average before rounding. */
  exactAverage: number;
  count: number;
};

export function getProductRating(
  reviews: ProductReview[] | undefined,
): ProductRatingSummary | null {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const exactAverage =
    reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
    reviews.length;

  const average = Math.round(exactAverage * 2) / 2;

  return {
    average,
    exactAverage,
    count: reviews.length,
  };
}
