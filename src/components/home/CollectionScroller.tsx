"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Collection } from "@/types/collection";

type CollectionScrollerProps = {
  basePath?: string;
  collections: Collection[];
};

export function CollectionScroller({
  basePath = "/collections",
  collections,
}: CollectionScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollCollections(direction: "previous" | "next") {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const scrollAmount = scroller.clientWidth;
    scroller.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative min-w-0 max-w-full">
      <button
        aria-label="Scroll to previous collections"
        className="absolute left-2 top-[calc(50%-0.75rem)] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 shadow-[var(--shadow-sm)] transition hover:border-neutral-950 lg:left-2 lg:size-11"
        onClick={() => scrollCollections("previous")}
        type="button"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div
        className="flex min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollerRef}
      >
        {collections.map((collection) => (
          <Link
            className="group flex min-w-[calc((100%_-_0.75rem)/2)] shrink-0 snap-start flex-col items-center gap-2 lg:min-w-[calc((100%_-_3rem)/5)]"
            href={`${basePath}/${collection.slug}`}
            key={collection.id}
          >
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 sm:h-52 lg:h-56">
              {collection.image ? (
                <div className="absolute inset-0 flex items-center justify-center transition duration-300 group-hover:scale-105">
                  <div
                    className={`relative h-full w-full ${collection.image.objectClassName ?? ""}`}
                  >
                    <Image
                      alt={collection.image.alt}
                      className="object-contain"
                      fill
                      sizes="(max-width: 1024px) 45vw, 15vw"
                      src={collection.image.url}
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <h3 className="w-full truncate px-1 text-center text-sm font-semibold tracking-tight text-neutral-950">
              {collection.name}
            </h3>
          </Link>
        ))}
      </div>

      <button
        aria-label="Scroll to next collections"
        className="absolute right-2 top-[calc(50%-0.75rem)] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 shadow-[var(--shadow-sm)] transition hover:border-neutral-950 lg:right-2 lg:size-11"
        onClick={() => scrollCollections("next")}
        type="button"
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
