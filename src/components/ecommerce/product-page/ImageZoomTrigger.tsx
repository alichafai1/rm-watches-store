"use client";

import Image from "next/image";
import { useState, type MouseEvent, type ReactNode } from "react";

type ImageZoomTriggerProps = {
  alt: string;
  src: string;
  onOpen: () => void;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  children?: ReactNode;
};

export function ImageZoomTrigger({
  alt,
  src,
  onOpen,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
  children,
}: ImageZoomTriggerProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <button
      aria-label="Zoom image"
      className={`relative overflow-hidden border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
        cursor ? "cursor-none" : "cursor-zoom-in"
      } ${className}`}
      onClick={onOpen}
      onMouseEnter={handleMove}
      onMouseLeave={() => setCursor(null)}
      onMouseMove={handleMove}
      type="button"
    >
      <Image
        alt={alt}
        className={imageClassName}
        fill
        priority={priority}
        sizes={sizes}
        src={src}
      />

      {cursor ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-md"
          style={{ left: cursor.x, top: cursor.y }}
        >
          <ZoomInIcon />
        </span>
      ) : null}

      {children}
    </button>
  );
}

function ZoomInIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}
