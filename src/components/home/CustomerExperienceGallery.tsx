"use client";

import { useEffect, useRef, useState } from "react";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import { LinkButton } from "@/components/ui/LinkButton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { cn } from "@/lib/utils/cn";
import type { CustomerReview } from "@/types/customer-review";

type CustomerExperienceGalleryProps = {
  reviews: CustomerReview[];
};

const customerAvatarFallback = "/images/placeholders/customer-avatar.svg";

function getReviewImageSrc(review: CustomerReview) {
  return review.reviewImage || review.productImage;
}

function getReviewImageAlt(review: CustomerReview) {
  return (
    review.reviewImageAlt ??
    (review.productName
      ? `${review.customerName} review for ${review.productName}`
      : `${review.customerName} customer review`)
  );
}

function getCustomerImageAlt(review: CustomerReview) {
  return review.customerImageAlt ?? `${review.customerName} profile photo`;
}

function ReviewCustomerAvatar({
  className,
  review,
  size,
}: {
  className?: string;
  review: CustomerReview;
  size: number;
}) {
  const [useFallback, setUseFallback] = useState(false);

  const src = useFallback ? customerAvatarFallback : review.customerImage;

  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden", className)}
      style={{ height: size, width: size }}
    >
      <StorefrontImage
        alt={getCustomerImageAlt(review)}
        className="object-cover object-center"
        fill
        onError={() => setUseFallback(true)}
        preset="avatar"
        sizes={`${size}px`}
        src={src}
      />
    </span>
  );
}

function StarRating({
  className,
  rating,
}: {
  className?: string;
  rating: number;
}) {
  return (
    <div
      aria-label={`${rating} out of 5 stars`}
      className={cn("flex gap-0.5", className)}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          aria-hidden="true"
          className={cn(
            "size-3.5",
            index < rating ? "text-[#d6bd7f]" : "text-neutral-300",
          )}
          fill="currentColor"
          key={index}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewDetailPanel({
  onClose,
  review,
}: {
  onClose: () => void;
  review: CustomerReview;
}) {
  return (
    <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="relative aspect-[4/5] min-h-[280px] bg-neutral-100 md:aspect-auto md:min-h-[520px]">
        <StorefrontImage
          alt={getReviewImageAlt(review)}
          className="object-cover"
          fill
          preset="review"
          sizes="(max-width: 768px) 100vw, 50vw"
          src={getReviewImageSrc(review)}
        />
      </div>

      <div className="grid max-h-[70vh] content-start gap-6 overflow-y-auto p-6 sm:p-8 md:max-h-none">
        <div className="flex items-start justify-between gap-4">
          <StarRating className="[&_svg]:size-4" rating={review.rating} />
          <button
            aria-label="Close review details"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition duration-200 hover:border-neutral-950 hover:text-neutral-950"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <blockquote className="text-lg leading-8 text-neutral-800">
          “{review.reviewText}”
        </blockquote>

        <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
          <ReviewCustomerAvatar
            key={review.customerImage}
            className="rounded-full border border-neutral-200 bg-neutral-100"
            review={review}
            size={48}
          />
          <div>
            <p className="text-sm font-semibold text-neutral-950">
              {review.customerName}
            </p>
          </div>
        </div>

        {review.productSlug ? (
          <>
            <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d3f]">
                Purchased watch
              </p>
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <StorefrontImage
                    alt={review.productName}
                    className="object-cover"
                    fill
                    preset="reviewThumb"
                    sizes="64px"
                    src={review.productImage}
                  />
                </div>
                <div className="grid gap-1">
                  <p className="font-medium text-neutral-950">{review.productName}</p>
                  <p className="text-sm text-neutral-500">
                    Customer-selected timepiece
                  </p>
                </div>
              </div>
            </div>

            <LinkButton href={`/products/${review.productSlug}`} size="lg">
              View This Watch
            </LinkButton>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function CustomerExperienceGallery({
  reviews,
}: CustomerExperienceGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(
    null,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (selectedReview) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [selectedReview]);

  const handleClose = () => {
    setSelectedReview(null);
  };

  return (
    <>
      <ResponsiveGrid columns="four">
        {reviews.map((review) => (
          <article key={review.id}>
            <button
              aria-label={`View review from ${review.customerName}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl text-left transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7d3f] focus-visible:ring-offset-2"
              onClick={() => setSelectedReview(review)}
              type="button"
            >
              <StorefrontImage
                alt={getReviewImageAlt(review)}
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                fill
                preset="reviewGrid"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                src={getReviewImageSrc(review)}
              />
            </button>
          </article>
        ))}
      </ResponsiveGrid>

      <dialog
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/70"
        onCancel={handleClose}
        onClose={handleClose}
        ref={dialogRef}
      >
        {selectedReview ? (
          <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <button
              aria-label="Close review details"
              className="fixed inset-0 bg-black/70"
              onClick={handleClose}
              type="button"
            />
            <ReviewDetailPanel onClose={handleClose} review={selectedReview} />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
