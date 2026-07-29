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
    const percent = Math.round((counts[label] / total) * 100);
    return {
      label: String(label),
      value: `${percent}%`,
      percent,
    };
  });
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return null;
  }

  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const ratingRows = buildRatingRows(reviews);

  return (
    <section aria-labelledby="product-reviews-heading" className="border-t border-neutral-200 pt-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Customer reviews
          </p>
          <h2
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950"
            id="product-reviews-heading"
          >
            Customer Reviews
          </h2>
        </div>
        <p className="text-sm text-neutral-600">
          Verified feedback from customers who purchased this watch.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-5xl font-semibold tracking-tight text-neutral-950">
            {averageRating.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>
          <div className="mt-5 grid gap-2">
            {ratingRows.map((row) => (
              <div className="grid grid-cols-[24px_1fr_40px] items-center gap-2 text-xs" key={row.label}>
                <span>{row.label}</span>
                <div className="h-1.5 rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-[#b08a3c]"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="text-right text-neutral-500">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              className="rounded-2xl border border-neutral-200 bg-white p-5"
              key={review.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-950">
                    {review.author}
                  </h3>
                  <p className="text-xs text-neutral-500">{review.date}</p>
                </div>
                <p className="text-xs font-semibold text-[#9a752e]">
                  {review.rating}/5
                </p>
              </div>
              {review.title ? (
                <p className="mt-4 text-sm font-semibold text-neutral-950">
                  {review.title}
                </p>
              ) : null}
              <p className={`text-sm leading-6 text-neutral-600 ${review.title ? "mt-2" : "mt-4"}`}>
                {review.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
