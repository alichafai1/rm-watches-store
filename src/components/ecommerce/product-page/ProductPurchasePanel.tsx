"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/useCart";
import { Button } from "@/components/ui/Button";
import { STOREFRONT_IMAGE_QUALITY } from "@/constants/image-quality";
import {
  paymentIconUrl,
  paymentMethods,
} from "@/constants/payment-methods";
import { trackAddToCart, trackEvent } from "@/lib/analytics/gtag";
import { cn } from "@/lib/utils/cn";
import type { CartItemInput } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

type ProductPurchasePanelProps = {
  onVariantChange: (variant: ProductVariant) => void;
  product: Product;
  selectedVariant: ProductVariant | null;
};

export function ProductPurchasePanel({
  onVariantChange,
  product,
  selectedVariant,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variants = product.variants;
  const hasVariants = variants.length > 0;
  const isSoldOut = product.stock === "out_of_stock";
  const selectedVariantName = selectedVariant?.name ?? "";

  useEffect(() => {
    return () => {
      if (addedTimeout.current) clearTimeout(addedTimeout.current);
    };
  }, []);

  function buildCartItem(): CartItemInput {
    const image = product.images[0];

    return {
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      image: image ? { alt: image.alt, url: image.url } : undefined,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      unitPrice: selectedVariant?.price ?? product.price,
      variantName: selectedVariant?.name,
    };
  }

  function trackCartAdd() {
    const unitPrice = selectedVariant?.price ?? product.price;
    trackAddToCart({
      currency: product.currency,
      value: unitPrice * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_variant: selectedVariant?.name,
          price: unitPrice,
          quantity,
        },
      ],
    });
  }

  function handleAddToCart() {
    addItem(buildCartItem(), quantity);
    trackCartAdd();
    setJustAdded(true);

    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setJustAdded(false), 2200);
  }

  function handleBuyNow() {
    addItem(buildCartItem(), quantity);
    trackCartAdd();
    trackEvent("buy_now", {
      currency: product.currency,
      value: (selectedVariant?.price ?? product.price) * quantity,
      item_id: product.id,
      item_name: product.title,
    });
    router.push("/checkout");
  }

  return (
    <div className="grid gap-6">
      {hasVariants ? (
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Choose version
          </legend>
          <div
            className={cn(
              "mt-2.5 gap-2",
              // A short list shares one row on phones as equal columns; a longer
              // one would squeeze the labels, so it keeps wrapping.
              variants.length <= 4
                ? "grid grid-flow-col auto-cols-fr sm:flex sm:flex-wrap"
                : "flex flex-wrap",
            )}
          >
            {variants.map((variant) => {
              const isSelected = selectedVariantName === variant.name;

              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    "whitespace-nowrap rounded-lg border px-2 py-2.5 text-center text-[13px] sm:px-4 sm:text-sm",
                    isSelected
                      ? "border-[#b08a3c] bg-[#f8f2e8] font-semibold text-neutral-950"
                      : "border-neutral-200 bg-white font-medium text-neutral-800 hover:border-neutral-400",
                  )}
                  key={variant.name}
                  onClick={() => onVariantChange(variant)}
                  type="button"
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Quantity
        </p>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
            <div className="flex min-h-12 items-center justify-between rounded-md border border-neutral-300 bg-white">
              <button
                aria-label="Decrease quantity"
                className="h-full px-4 text-lg text-neutral-700"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                type="button"
              >
                -
              </button>
              <span className="text-sm font-medium text-neutral-950">
                {quantity}
              </span>
              <button
                aria-label="Increase quantity"
                className="h-full px-4 text-lg text-neutral-700"
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                +
              </button>
            </div>
            <Button
              className="min-h-12 uppercase tracking-wide"
              disabled={isSoldOut}
              onClick={handleAddToCart}
            >
              {justAdded ? "Added To Cart" : "Add To Cart"}
            </Button>
          </div>

          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#9a752e] bg-[#9a752e] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:border-[#866432] hover:bg-[#866432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a752e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSoldOut}
            onClick={handleBuyNow}
            type="button"
          >
            Buy Now
          </button>
          <p
            aria-live="polite"
            className="text-center text-xs leading-relaxed text-neutral-500 sm:text-[13px]"
          >
            {justAdded
              ? "Added to your cart — open the cart to check out."
              : "Express checkout — skip the cart and pay securely"}
          </p>
        </div>

        <div className="mt-4 select-none [-webkit-user-drag:none] touch-pan-y">
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium tracking-[0.04em] text-neutral-600 sm:text-[13px]">
            <LockIcon />
            <span>Guaranteed safe &amp; secure checkout</span>
          </div>
          <ul
            aria-label="Accepted payment methods"
            className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 overflow-hidden overscroll-none touch-pan-y"
          >
            {paymentMethods.map((method) => (
              <li
                className="relative flex h-7 items-center justify-center overflow-hidden sm:h-9"
                key={method.name}
                title={method.name}
              >
                <Image
                  alt={method.name}
                  className="pointer-events-none select-none object-contain [-webkit-user-drag:none]"
                  draggable={false}
                  height={28}
                  quality={STOREFRONT_IMAGE_QUALITY}
                  sizes="48px"
                  src={paymentIconUrl(method.path)}
                  width={48}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 text-[#9a752e]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="11" rx="2" width="14" x="5" y="11" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
