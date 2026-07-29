"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/ecommerce/product-page/ProductGallery";
import { ProductPurchasePanel } from "@/components/ecommerce/product-page/ProductPurchasePanel";
import { formatPrice } from "@/lib/utils/format-price";
import type { BreadcrumbItem } from "@/types/seo";
import type {
  Product,
  ProductCollectionReference,
  ProductVariant,
} from "@/types/product";

type ProductMainSectionProps = {
  breadcrumbs: BreadcrumbItem[];
  collection?: ProductCollectionReference;
  product: Product;
};

export function ProductMainSection({
  breadcrumbs,
  collection,
  product,
}: ProductMainSectionProps) {
  const initialVariant = product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialVariant ?? null,
  );

  const displayPrice = selectedVariant?.price ?? product.price;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > displayPrice
      ? 20
      : undefined;
  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      : null;
  const filledStars = averageRating ? Math.round(averageRating) : 0;

  return (
    <section aria-labelledby="product-title" className="grid gap-6">
      <Breadcrumbs className="mb-0" items={breadcrumbs} />
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <ProductGallery
          discountPercent={discountPercent}
          images={product.images}
          productTitle={product.title}
          showHot={product.isBestSeller}
        />
        <div className="grid gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a752e]">
              {collection?.name ?? "Collection"}
            </p>
            <h1
              className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl"
              id="product-title"
            >
              {product.title}
            </h1>
            {averageRating ? (
              <div
                aria-label={`${averageRating.toFixed(1)} out of 5 from ${reviewCount} reviews`}
                className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-700"
              >
                <span aria-hidden="true" className="flex gap-0.5 text-[#b08a3c]">
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      className={`size-4 ${index < filledStars ? "fill-current" : "fill-none stroke-current"}`}
                      key={index}
                      viewBox="0 0 20 20"
                    >
                      <path d="m10 1.5 2.6 5.3 5.9.8-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.8L10 1.5Z" />
                    </svg>
                  ))}
                </span>
                <span>
                  {averageRating.toFixed(1)} · {reviewCount} review
                  {reviewCount === 1 ? "" : "s"}
                </span>
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <p className="text-2xl font-semibold text-neutral-950">
                {formatPrice(displayPrice, product.currency)}
              </p>
              {product.compareAtPrice &&
              product.compareAtPrice > displayPrice ? (
                <p className="text-lg text-neutral-500 line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </p>
              ) : null}
            </div>
            <div className="mt-5 grid gap-3">
              {["Free Shipping", "Easy Returns", "Secure Payment"].map(
                (item) => (
                  <div
                    className="flex items-center gap-2 text-sm text-neutral-700"
                    key={item}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#d8c28a] text-[#9a752e]">
                      <svg
                        aria-hidden="true"
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <ProductPurchasePanel
            currency={product.currency}
            onVariantChange={setSelectedVariant}
            selectedVariantName={selectedVariant?.name ?? ""}
            variants={product.variants}
          />
        </div>
      </div>
    </section>
  );
}
