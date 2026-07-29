"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  paymentIconUrl,
  paymentMethods,
} from "@/constants/payment-methods";
import type { CurrencyCode, ProductVariant } from "@/types/product";

type ProductPurchasePanelProps = {
  currency: CurrencyCode;
  onVariantChange: (variant: ProductVariant) => void;
  selectedVariantName: string;
  variants: ProductVariant[];
};

export function ProductPurchasePanel({
  onVariantChange,
  selectedVariantName,
  variants,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const hasVariants = variants.length > 0;

  return (
    <div className="grid gap-6">
      {hasVariants ? (
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Choose version
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariantName === variant.name;

              return (
                <button
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? "rounded-lg border border-[#b08a3c] bg-[#f8f2e8] px-4 py-2.5 text-sm font-semibold text-neutral-950"
                      : "rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:border-neutral-400"
                  }
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
            <Button className="min-h-12 uppercase tracking-wide" disabled>
              Add To Cart
            </Button>
          </div>

          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#9a752e] bg-[#9a752e] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:border-[#866432] hover:bg-[#866432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a752e] focus-visible:ring-offset-2"
            type="button"
          >
            Buy Now
          </button>
          <p className="text-center text-[11px] leading-relaxed text-neutral-500">
            Express checkout — skip the cart and pay securely
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-[0.04em] text-neutral-600">
            <LockIcon />
            <span>Guaranteed safe &amp; secure checkout</span>
          </div>
          <ul
            aria-label="Accepted payment methods"
            className="mt-2.5 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {paymentMethods.map((method) => (
              <li
                className="relative flex h-7 shrink-0 items-center justify-center sm:h-8"
                key={method.name}
                title={method.name}
              >
                <Image
                  alt={method.name}
                  className="object-contain"
                  height={24}
                  src={paymentIconUrl(method.path)}
                  unoptimized
                  width={44}
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
      className="size-3 text-[#9a752e]"
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
