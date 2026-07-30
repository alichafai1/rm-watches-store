"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

type ImageZoomTriggerProps = {
  alt: string;
  src: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  children?: ReactNode;
  /** Resting display scale (crop-in). Default 1 */
  displayScale?: number;
  /** Zoom scale when clicked. Default 2.4 */
  zoomScale?: number;
  onSwipeNext?: () => void;
  onSwipePrevious?: () => void;
};

type Point = { x: number; y: number };

const SWIPE_THRESHOLD_PX = 48;

function pointFromEvent(event: MouseEvent<HTMLButtonElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function originFromEvent(event: MouseEvent<HTMLButtonElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.min(
      100,
      Math.max(0, ((event.clientX - rect.left) / rect.width) * 100),
    ),
    y: Math.min(
      100,
      Math.max(0, ((event.clientY - rect.top) / rect.height) * 100),
    ),
  };
}

export function ImageZoomTrigger({
  alt,
  src,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
  children,
  displayScale = 1,
  zoomScale = 2.4,
  onSwipeNext,
  onSwipePrevious,
}: ImageZoomTriggerProps) {
  const [cursor, setCursor] = useState<Point | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState<Point>({ x: 50, y: 50 });
  const touchStartRef = useRef<Point | null>(null);
  const didSwipeRef = useRef(false);

  useEffect(() => {
    setIsZoomed(false);
    setOrigin({ x: 50, y: 50 });
    setCursor(null);
  }, [src]);

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const nextCursor = pointFromEvent(event);
    setCursor(nextCursor);

    if (isZoomed) {
      setOrigin(originFromEvent(event));
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }

    const nextOrigin = originFromEvent(event);
    setOrigin(nextOrigin);

    if (isZoomed) {
      setIsZoomed(false);
      return;
    }

    setIsZoomed(true);
  }

  function handleTouchStart(event: TouchEvent<HTMLButtonElement>) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    didSwipeRef.current = false;
  }

  function handleTouchEnd(event: TouchEvent<HTMLButtonElement>) {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch || isZoomed) {
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (
      Math.abs(dx) < SWIPE_THRESHOLD_PX ||
      Math.abs(dx) < Math.abs(dy) * 1.15
    ) {
      return;
    }

    didSwipeRef.current = true;

    if (dx < 0) {
      onSwipeNext?.();
    } else {
      onSwipePrevious?.();
    }
  }

  return (
    <button
      aria-label={isZoomed ? "Zoom out image" : "Zoom in on image"}
      className={`relative overflow-hidden border-0 bg-transparent p-0 outline-none touch-pan-y focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
        isZoomed ? "cursor-zoom-out" : cursor ? "cursor-none" : "cursor-zoom-in"
      } ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMove}
      onMouseLeave={() => {
        setCursor(null);
        if (isZoomed) {
          setIsZoomed(false);
        }
      }}
      onMouseMove={handleMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      type="button"
    >
      <Image
        alt={alt}
        className={imageClassName}
        fill
        priority={priority}
        sizes={sizes}
        src={src}
        style={{
          transform: isZoomed
            ? `scale(${zoomScale})`
            : `scale(${displayScale})`,
          transformOrigin: isZoomed
            ? `${origin.x}% ${origin.y}%`
            : "50% 50%",
        }}
      />

      {!isZoomed && cursor ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-md [@media(hover:hover)]:flex"
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
