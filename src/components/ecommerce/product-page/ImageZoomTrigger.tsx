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
  /** Zoom scale on pointer devices when clicked. Default 2.4 */
  zoomScale?: number;
  /**
   * Touch devices open the full-screen viewer instead of zooming in place: the
   * frame is far too small to explore a watch dial inside.
   */
  onRequestFullscreen?: () => void;
  onSwipeNext?: () => void;
  onSwipePrevious?: () => void;
};

type Point = { x: number; y: number };

const SWIPE_THRESHOLD_PX = 48;
const FADE_MS = 260;

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
  zoomScale = 2.4,
  onRequestFullscreen,
  onSwipeNext,
  onSwipePrevious,
}: ImageZoomTriggerProps) {
  const [cursor, setCursor] = useState<Point | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState<Point>({ x: 50, y: 50 });

  /**
   * The outgoing image stays mounted until the incoming one has loaded, so
   * switching images dissolves instead of flashing the empty frame.
   */
  const [layers, setLayers] = useState<{ current: string; outgoing: string | null }>({
    current: src,
    outgoing: null,
  });
  const [isCurrentLoaded, setIsCurrentLoaded] = useState(true);

  const touchStartRef = useRef<Point | null>(null);
  const didSwipeRef = useRef(false);
  const suppressClickRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (layers.current !== src) {
    setLayers({ current: src, outgoing: layers.current });
    setIsCurrentLoaded(false);
    setIsZoomed(false);
    setOrigin({ x: 50, y: 50 });
    setCursor(null);
  }

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  function handleCurrentLoaded() {
    setIsCurrentLoaded(true);

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setLayers((current) => ({ ...current, outgoing: null }));
    }, FADE_MS);
  }

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const nextCursor = pointFromEvent(event);
    setCursor(nextCursor);

    if (isZoomed) {
      setOrigin(originFromEvent(event));
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (didSwipeRef.current || suppressClickRef.current) {
      didSwipeRef.current = false;
      suppressClickRef.current = false;
      return;
    }

    const nextOrigin = originFromEvent(event);
    setOrigin(nextOrigin);
    setIsZoomed((current) => !current);
  }

  function handleTouchStart(event: TouchEvent<HTMLButtonElement>) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    didSwipeRef.current = false;
    // A previous tap may have opened the viewer without a click ever arriving.
    suppressClickRef.current = false;
  }

  function handleTouchEnd(event: TouchEvent<HTMLButtonElement>) {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) >= Math.abs(dy) * 1.15;

    if (isHorizontalSwipe) {
      didSwipeRef.current = true;

      if (dx < 0) {
        onSwipeNext?.();
      } else {
        onSwipePrevious?.();
      }
      return;
    }

    if (onRequestFullscreen && Math.hypot(dx, dy) < 12) {
      // The browser fires click after touchend; that click must not also zoom.
      suppressClickRef.current = true;
      onRequestFullscreen();
    }
  }

  const zoomStyle = {
    transform: isZoomed ? `scale(${zoomScale})` : "scale(1)",
    transformOrigin: `${origin.x}% ${origin.y}%`,
  };

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
      {layers.outgoing ? (
        <Image
          alt=""
          aria-hidden="true"
          className={imageClassName}
          fill
          key={layers.outgoing}
          sizes={sizes}
          src={layers.outgoing}
          style={zoomStyle}
        />
      ) : null}

      <Image
        alt={alt}
        className={`${imageClassName} transition-opacity duration-[260ms] ease-out ${
          isCurrentLoaded ? "opacity-100" : "opacity-0"
        }`}
        fill
        key={layers.current}
        onLoad={handleCurrentLoaded}
        priority={priority}
        sizes={sizes}
        src={layers.current}
        style={zoomStyle}
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
