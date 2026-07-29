"use client";

import { useState } from "react";
import type { ProductReview } from "@/types/product";

type ProductReviewsProps = {
  reviews: ProductReview[];
};

const INITIAL_VISIBLE = 3;

function buildRatingRows(reviews: ProductReview[]) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = reviews.length || 1;

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    counts[rating] += 1;
  }

  return ([5, 4, 3, 2, 1] as const).map((label) => {
    const count = counts[label];
    const percent = Math.round((count / total) * 100);
    return {
      label: String(label),
      count,
      percent,
    };
  });
}

function StarRow({ rating, className = "" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-0.5 text-[#b08a3c] ${className}`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          className={`size-3.5 ${index < filled ? "fill-current" : "fill-none stroke-current"}`}
          key={index}
          viewBox="0 0 20 20"
        >
          <path d="m10 1.5 2.6 5.3 5.9.8-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.8L10 1.5Z" />
        </svg>
      ))}
    </span>
  );
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const [expanded, setExpanded] = useState(false);

  if (reviews.length === 0) {
    return null;
  }

  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const ratingRows = buildRatingRows(reviews);
  const visibleReviews = expanded
    ? reviews
    : reviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, reviews.length - INITIAL_VISIBLE);

  return (
    <section
      aria-labelledby="product-reviews-heading"
      className="border-t border-neutral-200 pt-10"
      id="customer-reviews"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <h2
            className="text-2xl font-semibold tracking-tight text-neutral-950"
            id="product-reviews-heading"
          >
            Customer Reviews
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <p className="text-3xl font-semibold tracking-tight text-neutral-950">
              {averageRating.toFixed(1)}
            </p>
            <StarRow rating={averageRating} />
            <p className="text-sm text-neutral-500">
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-1.5">
          {ratingRows.map((row) => (
            <div
              className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2 text-xs text-neutral-600"
              key={row.label}
            >
              <span className="tabular-nums">{row.label} ★</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-[#b08a3c]"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="text-right tabular-nums text-neutral-500">
                {row.count}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {visibleReviews.map((review) => (
            <article className="py-5" key={review.id}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <StarRow rating={review.rating} />
                <h3 className="text-sm font-semibold text-neutral-950">
                  {review.author}
                </h3>
                <time className="text-xs text-neutral-500" dateTime={review.date}>
                  {review.date}
                </time>
              </div>
              {review.title ? (
                <p className="mt-2 text-sm font-semibold text-neutral-950">
                  {review.title}
                </p>
              ) : null}
              <p
                className={`text-sm leading-6 text-neutral-600 ${
                  review.title ? "mt-1.5" : "mt-2"
                }`}
              >
                {review.body}
              </p>
            </article>
          ))}
        </div>

        {hiddenCount > 0 ? (
          <div className="mt-5 flex justify-center">
            <button
              aria-expanded={expanded}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 transition hover:border-neutral-950"
              onClick={() => setExpanded((current) => !current)}
              type="button"
            >
              {expanded
                ? "Show fewer reviews"
                : `Show all ${reviews.length} reviews`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
