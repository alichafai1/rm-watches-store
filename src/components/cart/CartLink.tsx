"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/useCart";

export function CartLink() {
  const { isHydrated, itemCount } = useCart();
  const hasItems = isHydrated && itemCount > 0;

  return (
    <Link
      aria-label={hasItems ? `Checkout, ${itemCount} item(s)` : "Checkout"}
      className="relative inline-flex size-10 items-center justify-center rounded-md border border-transparent text-neutral-950 hover:bg-neutral-100"
      href="/checkout"
    >
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
      >
        <path d="M6 7h12l-1 14H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {hasItems ? (
        <span className="absolute right-0.5 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#9a752e] px-1 text-[10px] font-bold leading-none text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
