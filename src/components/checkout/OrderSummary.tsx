"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckoutAssuranceList } from "@/components/checkout/CheckoutTrustBadges";
import { MAX_ITEM_QUANTITY } from "@/lib/cart/cart-storage";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { CartItem } from "@/types/cart";
import type { CurrencyCode } from "@/types/product";

type OrderSummaryProps = {
  currency: CurrencyCode;
  items: CartItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  shippingCost: number;
  subtotal: number;
};

export function OrderSummary({
  currency,
  items,
  onQuantityChange,
  onRemove,
  shippingCost,
  subtotal,
}: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  const compareAtTotal = items.reduce(
    (total, item) =>
      total + (item.compareAtPrice ?? item.unitPrice) * item.quantity,
    0,
  );
  const savings = Math.round((compareAtTotal - subtotal) * 100) / 100;
  const total = Math.round((subtotal + shippingCost) * 100) / 100;

  function handleApplyDiscount() {
    if (!discountCode.trim()) return;
    setDiscountMessage("That code isn't valid for this order.");
  }

  return (
    <div className="grid gap-6">
      <ul className="grid gap-5">
        {items.map((item) => (
          <li className="flex items-start gap-4" key={item.id}>
            <span className="relative block size-16 shrink-0 rounded-xl border border-neutral-200 bg-white">
              {item.image ? (
                <Image
                  alt={item.image.alt}
                  className="rounded-xl object-contain object-center p-1"
                  fill
                  sizes="64px"
                  src={item.image.url}
                />
              ) : null}
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-700 px-1.5 text-[11px] font-semibold text-white">
                {item.quantity}
              </span>
            </span>

            <div className="min-w-0 flex-1">
              <Link
                className="line-clamp-2 text-sm font-medium leading-5 text-neutral-950 hover:underline"
                href={`/products/${item.slug}`}
              >
                {item.title}
              </Link>
              {item.variantName ? (
                <p className="mt-1 text-[13px] text-neutral-500">
                  {item.variantName}
                </p>
              ) : null}
              <div className="mt-2 flex items-center gap-3">
                <div className="inline-flex items-center rounded-lg border border-neutral-300 bg-white">
                  <button
                    aria-label={`Decrease quantity of ${item.title}`}
                    className="px-2.5 py-1 text-neutral-600 hover:text-neutral-950"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    type="button"
                  >
                    &minus;
                  </button>
                  <span className="min-w-6 text-center text-[13px] font-medium text-neutral-950">
                    {item.quantity}
                  </span>
                  <button
                    aria-label={`Increase quantity of ${item.title}`}
                    className="px-2.5 py-1 text-neutral-600 hover:text-neutral-950 disabled:opacity-40"
                    disabled={item.quantity >= MAX_ITEM_QUANTITY}
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-[13px] text-neutral-500 underline-offset-4 hover:text-neutral-950 hover:underline"
                  onClick={() => onRemove(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-neutral-950">
                {formatPrice(item.unitPrice * item.quantity, currency)}
              </p>
              {item.compareAtPrice && item.compareAtPrice > item.unitPrice ? (
                <p className="text-[13px] text-neutral-400 line-through">
                  {formatPrice(item.compareAtPrice * item.quantity, currency)}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-2 border-t border-neutral-200 pt-6 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="discount-code">
          Discount code
        </label>
        <input
          className="min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:border-[#b08a3c] focus:outline-none focus:ring-2 focus:ring-[#b08a3c]/25"
          id="discount-code"
          onChange={(event) => {
            setDiscountCode(event.target.value);
            setDiscountMessage(null);
          }}
          placeholder="Discount code"
          value={discountCode}
        />
        <button
          className={cn(
            "min-h-11 rounded-lg border border-neutral-300 px-5 text-sm font-medium text-neutral-700 transition duration-150",
            discountCode.trim()
              ? "hover:border-neutral-950 hover:text-neutral-950"
              : "cursor-not-allowed opacity-50",
          )}
          disabled={!discountCode.trim()}
          onClick={handleApplyDiscount}
          type="button"
        >
          Apply
        </button>
        {discountMessage ? (
          <p aria-live="polite" className="text-[13px] text-[#c45c4a] sm:col-span-2">
            {discountMessage}
          </p>
        ) : null}
      </div>

      <dl className="grid gap-3 border-t border-neutral-200 pt-6 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-neutral-600">Subtotal</dt>
          <dd className="font-medium text-neutral-950">
            {formatPrice(subtotal, currency)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-neutral-600">Shipping</dt>
          <dd className="font-medium text-neutral-950">
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost, currency)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
          <dt className="text-base font-semibold text-neutral-950">Total</dt>
          <dd className="flex items-baseline gap-2">
            <span className="text-[13px] uppercase tracking-[0.12em] text-neutral-500">
              {currency}
            </span>
            <span className="text-2xl font-semibold tracking-tight text-neutral-950">
              {formatPrice(total, currency)}
            </span>
          </dd>
        </div>
      </dl>

      {/* Sits outside the totals list: the subtotal is already discounted, so
          listing it as a row would read as a second deduction. */}
      {savings > 0 ? (
        <p className="rounded-lg bg-[#f8f2e8] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9a752e]">
          You save {formatPrice(savings, currency)} on this order
        </p>
      ) : null}

      <div className="border-t border-neutral-200 pt-6">
        <CheckoutAssuranceList />
      </div>
    </div>
  );
}
