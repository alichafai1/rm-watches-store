"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ImageZoomTrigger } from "@/components/ecommerce/product-page/ImageZoomTrigger";
import type { ProductAbout } from "@/types/product";

type ProductAboutSectionProps = {
  about: ProductAbout;
};

export function ProductAboutSection({ about }: ProductAboutSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section aria-labelledby="product-about-heading" className="grid gap-5">
      <h2
        className="order-2 text-xl font-semibold tracking-tight text-neutral-950 lg:order-1"
        id="product-about-heading"
      >
        {about.title}
      </h2>

      <ImageZoomTrigger
        alt={about.image.alt}
        className="order-1 mx-auto aspect-[4/3] w-full max-w-md lg:order-2 lg:mx-0 lg:max-w-none"
        imageClassName="object-contain p-1 sm:p-2"
        onOpen={() => setLightboxOpen(true)}
        sizes="(min-width: 1024px) 28vw, 100vw"
        src={about.image.url}
      />

      <p className="order-3 text-sm leading-7 text-neutral-700">
        {about.description}
      </p>

      {mounted && lightboxOpen
        ? createPortal(
            <AboutImageLightbox
              alt={about.image.alt}
              onClose={() => setLightboxOpen(false)}
              src={about.image.url}
            />,
            document.body,
          )
        : null}
    </section>
  );
}

type AboutImageLightboxProps = {
  alt: string;
  onClose: () => void;
  src: string;
};

function AboutImageLightbox({ alt, onClose, src }: AboutImageLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
          return;
        }
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isZoomed, onClose]);

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
      aria-label="About image zoom view"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex flex-col bg-black/90"
      role="dialog"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-xs tracking-[0.16em] text-white/60 uppercase">
          <span className="normal-case tracking-normal text-white/40">
            {isZoomed ? "Click to zoom out" : "Click image to zoom"}
          </span>
        </p>
        <button
          aria-label="Close zoom view"
          className="flex size-10 items-center justify-center text-white transition hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-10">
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
            alt={alt}
            className={`object-contain transition-transform duration-200 ease-out ${
              isZoomed ? "scale-[2.25]" : "scale-100"
            }`}
            fill
            sizes="100vw"
            src={src}
            style={
              isZoomed
                ? { transformOrigin: `${origin.x}% ${origin.y}%` }
                : { transformOrigin: "50% 50%" }
            }
          />
        </button>
      </div>
    </div>
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
