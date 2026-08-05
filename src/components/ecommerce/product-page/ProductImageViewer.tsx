"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { GalleryArrow } from "@/components/ecommerce/product-page/GalleryArrow";
import type { ProductImage } from "@/types/product";

type ProductImageViewerProps = {
  activeIndex: number;
  images: ProductImage[];
  onClose: () => void;
  onIndexChange: (index: number) => void;
  productTitle: string;
};

type Point = { x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const TAP_SLOP_PX = 12;
const SWIPE_THRESHOLD_PX = 60;

const ORIGIN: Point = { x: 0, y: 0 };

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function ProductImageViewer({
  activeIndex,
  images,
  onClose,
  onIndexChange,
  productTitle,
}: ProductImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Point>(ORIGIN);
  /** While fingers are down the transform tracks them 1:1, with no easing. */
  const [isGesturing, setIsGesturing] = useState(false);

  const pointersRef = useRef(new Map<number, Point>());
  const pinchRef = useRef<{
    startDistance: number;
    startMidpoint: Point;
    startOffset: Point;
    startScale: number;
  } | null>(null);
  const dragRef = useRef<{ last: Point; start: Point; travel: number } | null>(
    null,
  );
  const lastTapRef = useRef(0);

  const activeImage = images[activeIndex];
  const hasMultiple = images.length > 1;

  // The component only mounts while open, so this runs once per open.
  useEffect(() => {
    dialogRef.current?.showModal();

    const { documentElement } = document;
    const previousOverflow = documentElement.style.overflow;
    documentElement.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = previousOverflow;
    };
  }, []);

  function resetTransform() {
    setScale(MIN_SCALE);
    setOffset(ORIGIN);
  }

  function goTo(index: number) {
    resetTransform();
    onIndexChange((index + images.length) % images.length);
  }

  /** Keeps the image from being dragged past its own scaled edges. */
  function clampOffset(next: Point, nextScale: number): Point {
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return next;

    const maxX = Math.max(0, ((nextScale - 1) * rect.width) / 2);
    const maxY = Math.max(0, ((nextScale - 1) * rect.height) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  /** Pointer position relative to the centre of the surface. */
  function toCentreSpace(point: Point): Point {
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return point;

    return {
      x: point.x - (rect.left + rect.width / 2),
      y: point.y - (rect.top + rect.height / 2),
    };
  }

  function toggleZoomAt(point: Point) {
    if (scale > MIN_SCALE) {
      resetTransform();
      return;
    }

    const centred = toCentreSpace(point);
    setScale(DOUBLE_TAP_SCALE);
    // Move the tapped detail toward the middle of the screen.
    setOffset(
      clampOffset(
        { x: -centred.x * (DOUBLE_TAP_SCALE - 1), y: -centred.y * (DOUBLE_TAP_SCALE - 1) },
        DOUBLE_TAP_SCALE,
      ),
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const point = { x: event.clientX, y: event.clientY };

    try {
      // Keeps a finger tracked if it slides outside the surface mid-gesture.
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The pointer was already released; the gesture still works without it.
    }

    pointersRef.current.set(event.pointerId, point);
    setIsGesturing(true);

    if (pointersRef.current.size === 2) {
      const [first, second] = [...pointersRef.current.values()];
      pinchRef.current = {
        startDistance: distance(first, second),
        startMidpoint: toCentreSpace(midpoint(first, second)),
        startOffset: offset,
        startScale: scale,
      };
      dragRef.current = null;
      return;
    }

    dragRef.current = { last: point, start: point, travel: 0 };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;

    const point = { x: event.clientX, y: event.clientY };
    pointersRef.current.set(event.pointerId, point);

    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      const [first, second] = [...pointersRef.current.values()];
      const ratio = distance(first, second) / (pinch.startDistance || 1);
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinch.startScale * ratio),
      );
      const currentMidpoint = toCentreSpace(midpoint(first, second));

      // Hold the content under the pinch midpoint in place, then follow the
      // midpoint so two fingers can zoom and move at the same time.
      const anchored = {
        x:
          pinch.startMidpoint.x -
          (pinch.startMidpoint.x - pinch.startOffset.x) *
            (nextScale / pinch.startScale) +
          (currentMidpoint.x - pinch.startMidpoint.x),
        y:
          pinch.startMidpoint.y -
          (pinch.startMidpoint.y - pinch.startOffset.y) *
            (nextScale / pinch.startScale) +
          (currentMidpoint.y - pinch.startMidpoint.y),
      };

      setScale(nextScale);
      setOffset(clampOffset(anchored, nextScale));
      return;
    }

    const drag = dragRef.current;
    if (!drag || pointersRef.current.size !== 1) return;

    const delta = { x: point.x - drag.last.x, y: point.y - drag.last.y };
    drag.travel += Math.hypot(delta.x, delta.y);
    drag.last = point;

    if (scale <= MIN_SCALE) return;

    setOffset((current) =>
      clampOffset({ x: current.x + delta.x, y: current.y + delta.y }, scale),
    );
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    pointersRef.current.delete(event.pointerId);

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    if (pointersRef.current.size === 1) {
      // Carry on panning with whichever finger is still down.
      const [remaining] = [...pointersRef.current.values()];
      dragRef.current = { last: remaining, start: remaining, travel: 0 };
      return;
    }

    if (pointersRef.current.size > 0) return;

    setIsGesturing(false);
    dragRef.current = null;

    if (!drag) return;

    if (drag.travel <= TAP_SLOP_PX) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        lastTapRef.current = 0;
        toggleZoomAt(drag.start);
      } else {
        lastTapRef.current = now;
      }
      return;
    }

    // Only swipe between images while the image sits at its natural size.
    if (scale > MIN_SCALE || !hasMultiple) return;

    const dx = drag.last.x - drag.start.x;
    const dy = drag.last.y - drag.start.y;

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;

    goTo(activeIndex + (dx < 0 ? 1 : -1));
  }

  if (!activeImage) return null;

  return (
    <dialog
      aria-label={`${productTitle} image viewer`}
      className="fixed inset-0 z-[var(--z-overlay)] m-0 h-full max-h-none w-full max-w-none border-0 bg-neutral-950 p-0 backdrop:bg-neutral-950"
      onCancel={onClose}
      onClose={onClose}
      onKeyDown={(event) => {
        if (!hasMultiple) return;
        if (event.key === "ArrowRight") goTo(activeIndex + 1);
        if (event.key === "ArrowLeft") goTo(activeIndex - 1);
      }}
      ref={dialogRef}
    >
      <div className="relative flex h-full w-full flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
          <p className="text-[13px] tabular-nums text-white/70">
            {activeIndex + 1} / {images.length}
          </p>
          <button
            aria-label="Close image viewer"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 transition duration-200 hover:bg-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          className="relative flex-1 overflow-hidden touch-none select-none"
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={surfaceRef}
          style={{ cursor: scale > MIN_SCALE ? "grab" : "zoom-in" }}
        >
          <Image
            alt={activeImage.alt || productTitle}
            className="object-contain"
            draggable={false}
            fill
            // Matches the gallery's mobile `sizes`, so on phones this reuses the
            // image already in cache instead of fetching a new variant.
            priority
            sizes="100vw"
            src={activeImage.url}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              transition: isGesturing ? "none" : "transform 220ms ease-out",
            }}
          />

          {hasMultiple && scale === MIN_SCALE ? (
            <>
              <GalleryArrow
                direction="previous"
                label="Previous image"
                onClick={() => goTo(activeIndex - 1)}
                tone="onOverlay"
              />
              <GalleryArrow
                direction="next"
                label="Next image"
                onClick={() => goTo(activeIndex + 1)}
                tone="onOverlay"
              />
            </>
          ) : null}
        </div>

        <p className="shrink-0 px-4 pb-4 text-center text-[13px] text-white/60 sm:pb-6">
          {scale > MIN_SCALE
            ? "Drag to explore · double tap to reset"
            : "Pinch or double tap to zoom"}
        </p>
      </div>
    </dialog>
  );
}
