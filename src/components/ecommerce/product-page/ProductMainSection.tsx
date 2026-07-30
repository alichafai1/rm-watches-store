"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/ecommerce/product-page/ProductGallery";
import { ProductPurchasePanel } from "@/components/ecommerce/product-page/ProductPurchasePanel";
import { ProductRatingStars } from "@/components/ecommerce/ProductRatingStars";
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
      ? Math.max(
          1,
          Math.round(
            ((product.compareAtPrice - displayPrice) / product.compareAtPrice) *
              100,
          ),
        )
      : undefined;

  return (
    <section aria-labelledby="product-title" className="grid gap-6">
      <Breadcrumbs className="mb-0" items={breadcrumbs} />
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <ProductGallery
          discountPercent={discountPercent}
          imageScale={
            product.slug ===
            "best-richard-mille-rm001-replica-men-s-tourbillon-watch-swiss-movement"
              ? 1.42
              : 1
          }
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
            <ProductRatingStars
              className="mt-3"
              reviews={product.reviews}
              size="md"
            />
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-2xl font-semibold tracking-tight text-neutral-950">
                {formatPrice(displayPrice, product.currency)}
              </p>
              {product.compareAtPrice &&
              product.compareAtPrice > displayPrice &&
              discountPercent ? (
                <>
                  <p className="text-base text-neutral-400 line-through decoration-neutral-400">
                    {formatPrice(product.compareAtPrice, product.currency)}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-[#c45c4a] px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-white uppercase">
                    Save {discountPercent}%
                  </span>
                </>
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
