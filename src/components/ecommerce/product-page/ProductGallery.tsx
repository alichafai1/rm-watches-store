"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { GalleryArrow } from "@/components/ecommerce/product-page/GalleryArrow";
import { ImageZoomTrigger } from "@/components/ecommerce/product-page/ImageZoomTrigger";
import { ProductImageViewer } from "@/components/ecommerce/product-page/ProductImageViewer";
import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: ProductImage[];
  productTitle: string;
  discountPercent?: number;
  showHot?: boolean;
};

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return (index + length) % length;
}

export function ProductGallery({
  images,
  productTitle,
  discountPercent,
  showHot = false,
}: ProductGalleryProps) {
  const labelId = useId();
  const galleryImages = images.length > 0 ? images : [];
  const imageSignature = galleryImages.map((image) => image.url).join("|");

  const [state, setState] = useState({ activeIndex: 0, signature: imageSignature });
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Switching to another product replaces the image set, so the index resets.
  if (state.signature !== imageSignature) {
    setState({ activeIndex: 0, signature: imageSignature });
  }

  const activeIndex = state.activeIndex;
  const activeImage = galleryImages[activeIndex];
  const hasMultiple = galleryImages.length > 1;

  function selectImage(index: number) {
    setState((current) => ({
      ...current,
      activeIndex: clampIndex(index, galleryImages.length),
    }));
  }

  if (!activeImage) {
    return (
      <div className="flex aspect-[5/4] items-center justify-center bg-white text-sm text-neutral-500">
        {productTitle} image placeholder
      </div>
    );
  }

  return (
    <div aria-labelledby={labelId} className="grid gap-3">
      <p className="sr-only" id={labelId}>
        Product images for {productTitle}
      </p>

      {/* `gallery-frame` drives the arrow hover reveal on pointer devices. */}
      <div
        className="gallery-frame relative"
        onKeyDown={(event) => {
          if (!hasMultiple) return;
          if (event.key === "ArrowRight") selectImage(activeIndex + 1);
          if (event.key === "ArrowLeft") selectImage(activeIndex - 1);
        }}
      >
        <ImageZoomTrigger
          alt={activeImage.alt || productTitle}
          className="aspect-[5/4] w-full rounded-[20px] bg-white shadow-none ring-0"
          imageClassName="object-contain"
          onRequestFullscreen={() => setIsViewerOpen(true)}
          onSwipeNext={
            hasMultiple
              ? () => selectImage(activeIndex + 1)
              : undefined
          }
          onSwipePrevious={
            hasMultiple
              ? () => selectImage(activeIndex - 1)
              : undefined
          }
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          src={activeImage.url}
        />

        {hasMultiple ? (
          <>
            <GalleryArrow
              direction="previous"
              label="Previous image"
              onClick={() => selectImage(activeIndex - 1)}
            />
            <GalleryArrow
              direction="next"
              label="Next image"
              onClick={() => selectImage(activeIndex + 1)}
            />
          </>
        ) : null}

        {hasMultiple ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 lg:hidden"
          >
            {galleryImages.map((image, index) => (
              <span
                className={`size-1.5 rounded-full transition ${
                  index === activeIndex ? "bg-neutral-900" : "bg-neutral-300"
                }`}
                key={`${image.url}-dot-${index}`}
              />
            ))}
          </div>
        ) : null}

        {discountPercent || showHot ? (
          <div className="pointer-events-none absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
            {discountPercent && discountPercent > 0 ? (
              <span className="inline-flex h-7 min-w-[2.75rem] items-center justify-center rounded-full bg-[#2a2a2a] px-2.5 text-[11px] font-semibold leading-none text-white tabular-nums">
                −{discountPercent}%
              </span>
            ) : null}
            {showHot ? (
              <span className="inline-flex h-7 items-center justify-center rounded-full bg-[#2a2a2a] px-2.5 text-[11px] font-semibold leading-none tracking-[0.14em] text-white uppercase">
                Hot
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 py-2 [scrollbar-width:thin]">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={`View image ${index + 1} of ${galleryImages.length}`}
                className={`relative aspect-square w-[88px] shrink-0 overflow-hidden rounded-[20px] bg-white outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:w-[110px] ${
                  isActive
                    ? "z-[1] scale-[1.06] opacity-100 shadow-[0_10px_24px_rgba(0,0,0,0.14)] ring-1 ring-[#b08a3c]"
                    : "scale-100 opacity-[0.78] hover:scale-[1.03] hover:opacity-100"
                }`}
                key={`${image.url}-${index}`}
                onClick={() => selectImage(index)}
                type="button"
              >
                <Image
                  alt={image.alt || `${productTitle} thumbnail ${index + 1}`}
                  className="object-contain"
                  fill
                  sizes="110px"
                  src={image.url}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {isViewerOpen ? (
        <ProductImageViewer
          activeIndex={activeIndex}
          images={galleryImages}
          onClose={() => setIsViewerOpen(false)}
          onIndexChange={selectImage}
          productTitle={productTitle}
        />
      ) : null}
    </div>
  );
}
