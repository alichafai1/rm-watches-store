"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ProductReview } from "@/types/product";

type ProductReviewsProps = {
  reviews: ProductReview[];
};

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

type PanelMode = "static" | "fixed" | "bottom";

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("static");
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const TOP_OFFSET = 80;

    function updatePanelPosition() {
      const section = sectionRef.current;
      const column = columnRef.current;
      const panel = panelRef.current;

      if (!section || !column || !panel) {
        return;
      }

      const isLaptop = window.matchMedia("(min-width: 1024px)").matches;
      if (!isLaptop) {
        setPanelMode("static");
        setPanelStyle({});
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const columnRect = column.getBoundingClientRect();
      const panelHeight = panel.offsetHeight;
      const width = columnRect.width;

      if (sectionRect.top > TOP_OFFSET) {
        setPanelMode("static");
        setPanelStyle({});
        return;
      }

      if (sectionRect.bottom <= TOP_OFFSET + panelHeight + 16) {
        setPanelMode("bottom");
        setPanelStyle({
          position: "absolute",
          left: 0,
          bottom: 0,
          width: `${width}px`,
        });
        return;
      }

      setPanelMode("fixed");
      setPanelStyle({
        position: "fixed",
        top: `${TOP_OFFSET}px`,
        left: `${columnRect.left}px`,
        width: `${width}px`,
      });
    }

    updatePanelPosition();
    window.addEventListener("scroll", updatePanelPosition, { passive: true });
    window.addEventListener("resize", updatePanelPosition);

    return () => {
      window.removeEventListener("scroll", updatePanelPosition);
      window.removeEventListener("resize", updatePanelPosition);
    };
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const ratingRows = buildRatingRows(reviews);

  return (
    <section
      aria-labelledby="product-reviews-heading"
      className="border-t border-neutral-200 pt-10"
      id="customer-reviews"
      ref={sectionRef}
    >
      <h2
        className="text-2xl font-semibold tracking-tight text-neutral-950"
        id="product-reviews-heading"
      >
        Customer Reviews
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <div className="relative hidden min-h-[1px] lg:block" ref={columnRef}>
          <aside
            className="z-[5] bg-white"
            ref={panelRef}
            style={panelMode === "static" ? undefined : panelStyle}
          >
            <p className="text-4xl font-semibold tracking-tight text-neutral-950">
              {averageRating.toFixed(1)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <StarRow rating={averageRating} />
              <span className="text-sm text-neutral-500">out of 5</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Based on {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </p>

            <div className="mt-5 grid gap-1.5">
              {ratingRows.map((row) => (
                <div
                  className="grid grid-cols-[2.75rem_1fr_1.25rem] items-center gap-2 text-xs text-neutral-600"
                  key={row.label}
                >
                  <span className="tabular-nums">{row.label} star</span>
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
          </aside>
        </div>

        {/* Mobile summary (not fixed) */}
        <div className="lg:hidden">
          <p className="text-4xl font-semibold tracking-tight text-neutral-950">
            {averageRating.toFixed(1)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <StarRow rating={averageRating} />
            <span className="text-sm text-neutral-500">out of 5</span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            Based on {reviews.length} review
            {reviews.length === 1 ? "" : "s"}
          </p>
          <div className="mt-5 grid gap-1.5">
            {ratingRows.map((row) => (
              <div
                className="grid grid-cols-[2.75rem_1fr_1.25rem] items-center gap-2 text-xs text-neutral-600"
                key={`mobile-${row.label}`}
              >
                <span className="tabular-nums">{row.label} star</span>
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
        </div>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {reviews.map((review) => (
            <article className="py-5" key={review.id}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <StarRow rating={review.rating} />
                <h3 className="text-sm font-semibold text-neutral-950">
                  {review.author}
                </h3>
                <time
                  className="text-xs text-neutral-500"
                  dateTime={review.date}
                >
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
      </div>
    </section>
  );
}
