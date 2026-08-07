import { getProductRating } from "@/lib/utils/product-rating";
import { cn } from "@/lib/utils/cn";
import type { ProductReview } from "@/types/product";

type ProductRatingStarsProps = {
  reviews: ProductReview[] | undefined;
  className?: string;
  /** Visual size of each star. */
  size?: "sm" | "md";
  /** Show "(13)" style count next to stars. Default true. */
  showCount?: boolean;
};

function starFill(average: number, index: number): "full" | "half" | "empty" {
  const value = average - index;

  if (value >= 0.75) {
    return "full";
  }

  if (value >= 0.25) {
    return "half";
  }

  return "empty";
}

/**
 * Pure rating display (no client hooks). Kept free of `"use client"` so
 * ProductCard can stay a Server Component, but it is also imported by the
 * client ProductMainSection — so gradient ids must be deterministic to avoid
 * SSR/client hydration mismatches.
 */
export function ProductRatingStars({
  reviews,
  className,
  size = "sm",
  showCount = true,
}: ProductRatingStarsProps) {
  const rating = getProductRating(reviews);

  if (!rating) {
    return null;
  }

  const gradientId = ratingGradientId(reviews, size, rating);
  const starClass = size === "md" ? "size-4" : "size-3.5";

  return (
    <div
      aria-label={`${rating.exactAverage.toFixed(1)} out of 5 from ${rating.count} reviews`}
      className={cn("flex items-center gap-1.5", className)}
    >
      <span
        aria-hidden="true"
        className="flex items-center gap-0.5 text-[#b08a3c]"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const fill = starFill(rating.average, index);

          if (fill === "half") {
            return (
              <HalfStar
                className={starClass}
                gradientId={`${gradientId}-half-${index}`}
                key={index}
              />
            );
          }

          return (
            <svg
              className={cn(
                starClass,
                fill === "full" ? "fill-current" : "fill-none stroke-current",
              )}
              key={index}
              viewBox="0 0 20 20"
            >
              <path d="m10 1.5 2.6 5.3 5.9.8-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.8L10 1.5Z" />
            </svg>
          );
        })}
      </span>
      {showCount ? (
        <span className="text-xs text-neutral-500">({rating.count})</span>
      ) : null}
    </div>
  );
}

/** Stable SVG id from review ids + size so SSR and client markup match. */
function ratingGradientId(
  reviews: ProductReview[] | undefined,
  size: string,
  rating: { count: number; exactAverage: number },
) {
  const reviewKey = (reviews ?? []).map((review) => review.id).join("-");
  const raw = `rating-${size}-${rating.count}-${rating.exactAverage.toFixed(2)}-${reviewKey}`;
  return raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120) || "rating-stars";
}

function HalfStar({
  className,
  gradientId,
}: {
  className: string;
  gradientId: string;
}) {
  return (
    <svg className={className} viewBox="0 0 20 20">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="m10 1.5 2.6 5.3 5.9.8-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.8L10 1.5Z"
        fill={`url(#${gradientId})`}
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}
