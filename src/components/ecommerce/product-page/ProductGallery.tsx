"use client";

import Image from "next/image";
import { useEffect, useId, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ImageZoomTrigger } from "@/components/ecommerce/product-page/ImageZoomTrigger";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeImage = galleryImages[activeIndex];
  const hasMultiple = galleryImages.length > 1;
  const imageSignature = galleryImages.map((image) => image.url).join("|");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageSignature]);

  function selectImage(index: number) {
    setActiveIndex(clampIndex(index, galleryImages.length));
  }

  if (!activeImage) {
    return (
      <div className="flex aspect-square items-center justify-center bg-white text-sm text-neutral-500">
        {productTitle} image placeholder
      </div>
    );
  }

  return (
    <div aria-labelledby={labelId} className="grid gap-3">
      <p className="sr-only" id={labelId}>
        Product images for {productTitle}
      </p>

      <div className="relative">
        <ImageZoomTrigger
          alt={activeImage.alt || productTitle}
          className="aspect-square w-full rounded-[20px] bg-white shadow-none ring-0"
          imageClassName="object-contain"
          onOpen={() => setLightboxOpen(true)}
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          src={activeImage.url}
        />

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

      {mounted && lightboxOpen
        ? createPortal(
            <ProductGalleryLightbox
              activeIndex={activeIndex}
              images={galleryImages}
              onClose={() => setLightboxOpen(false)}
              onSelect={selectImage}
              productTitle={productTitle}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

type LightboxProps = {
  activeIndex: number;
  images: ProductImage[];
  onClose: () => void;
  onSelect: (index: number) => void;
  productTitle: string;
};

function ProductGalleryLightbox({
  activeIndex,
  images,
  onClose,
  onSelect,
  productTitle,
}: LightboxProps) {
  const activeImage = images[activeIndex];
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setIsZoomed(false);
    setOrigin({ x: 50, y: 50 });
  }, [activeIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
          return;
        }
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onSelect(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        onSelect(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, isZoomed, onClose, onSelect]);

  if (!activeImage) {
    return null;
  }

  function updateOrigin(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  return (
    <div
      aria-label={`${productTitle} image gallery`}
      aria-modal="true"
      className="fixed inset-0 z-[80] flex flex-col bg-black/90"
      role="dialog"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-xs tracking-[0.16em] text-white/60 uppercase">
          {activeIndex + 1} / {images.length}
          <span className="ml-3 normal-case tracking-normal text-white/40">
            {isZoomed ? "Click to zoom out" : "Click image to zoom"}
          </span>
        </p>
        <button
          aria-label="Close gallery"
          className="flex size-10 items-center justify-center text-white transition hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-10">
        {images.length > 1 && !isZoomed ? (
          <>
            <button
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center text-white transition hover:bg-white/10 sm:left-6"
              onClick={() => onSelect(activeIndex - 1)}
              type="button"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center text-white transition hover:bg-white/10 sm:right-6"
              onClick={() => onSelect(activeIndex + 1)}
              type="button"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}

        <button
          aria-label={isZoomed ? "Zoom out image" : "Zoom in image"}
          className={`relative h-[min(72vh,820px)] w-full max-w-5xl overflow-hidden border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={(event) => {
            updateOrigin(event);
            setIsZoomed((current) => !current);
          }}
          onMouseMove={(event) => {
            if (isZoomed) {
              updateOrigin(event);
            }
          }}
          type="button"
        >
          <Image
            alt={activeImage.alt || productTitle}
            className={`object-contain transition-transform duration-200 ease-out ${
              isZoomed ? "scale-[2.25]" : "scale-100"
            }`}
            fill
            priority
            sizes="100vw"
            src={activeImage.url}
            style={
              isZoomed
                ? { transformOrigin: `${origin.x}% ${origin.y}%` }
                : { transformOrigin: "50% 50%" }
            }
          />
        </button>
      </div>

      {images.length > 1 ? (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={`Show image ${index + 1}`}
                className={`relative size-16 shrink-0 overflow-hidden rounded-xl bg-white transition-all duration-300 ease-out ${
                  isActive
                    ? "z-[1] scale-110 opacity-100 shadow-[0_8px_18px_rgba(0,0,0,0.35)] ring-1 ring-[#b08a3c]"
                    : "scale-100 opacity-[0.7] hover:scale-105 hover:opacity-100"
                }`}
                key={`${image.url}-lightbox-${index}`}
                onClick={() => onSelect(index)}
                type="button"
              >
                <Image
                  alt={image.alt || `${productTitle} ${index + 1}`}
                  className="object-contain"
                  fill
                  sizes="64px"
                  src={image.url}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {direction === "left" ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
