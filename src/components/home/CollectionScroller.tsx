"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import type { Collection } from "@/types/collection";

type CollectionScrollerProps = {
  basePath?: string;
  collections: Collection[];
};

/**
 * Desktop shows ~5 tiles; mobile ~2. SSR-mount the first 6 so the initial
 * viewport never flashes empty placeholders, then IntersectionObserver opens
 * a horizontal buffer as the user scrolls.
 */
const INITIAL_IMAGE_COUNT = 6;

function CollectionScrollerImage({
  alt,
  objectClassName,
  shouldLoadInitially,
  src,
}: {
  alt: string;
  objectClassName?: string;
  shouldLoadInitially: boolean;
  src: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(shouldLoadInitially);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const root = frame.closest<HTMLElement>("[data-collection-scroller]");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      {
        // One scroller-width of lookahead so the next page of tiles is warm.
        root,
        rootMargin: "0px 100% 0px 100%",
        threshold: 0,
      },
    );

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition duration-300 group-hover:scale-105"
      ref={frameRef}
    >
      {shouldLoad ? (
        <div className={`relative h-full w-full ${objectClassName ?? ""}`}>
          <StorefrontImage
            alt={alt}
            className="object-contain"
            fill
            preset="collectionScroller"
            sizes="(max-width: 1024px) 45vw, 15vw"
            src={src}
          />
        </div>
      ) : null}
    </div>
  );
}

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
        data-collection-scroller
        ref={scrollerRef}
      >
        {collections.map((collection, index) => (
          <Link
            className="group flex min-w-[calc((100%_-_0.75rem)/2)] shrink-0 snap-start flex-col items-center gap-2 lg:min-w-[calc((100%_-_3rem)/5)]"
            href={`${basePath}/${collection.slug}`}
            key={collection.id}
          >
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 sm:h-52 lg:h-56">
              {collection.image ? (
                <CollectionScrollerImage
                  alt={collection.image.alt}
                  objectClassName={collection.image.objectClassName}
                  shouldLoadInitially={index < INITIAL_IMAGE_COUNT}
                  src={collection.image.url}
                />
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
