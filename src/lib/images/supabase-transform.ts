/**
 * Supabase Storage image transforms (imgproxy) — used instead of Vercel
 * `/_next/image` so storefront media is resized/compressed without hitting
 * Vercel Image Optimization quotas (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
 *
 * Originals in `/storage/v1/object/public/...` are never modified. Transformed
 * bytes are generated on demand at `/storage/v1/render/image/public/...`.
 */

export type SupabaseResizeMode = "cover" | "contain" | "fill";

export type SupabaseTransformOptions = {
  /** Target width in CSS pixels (1–2500). Prefer width-only so aspect ratio is kept. */
  width?: number;
  height?: number;
  /** 20–100; Supabase default is 80. */
  quality?: number;
  resize?: SupabaseResizeMode;
};

/** Named sizes for storefront surfaces (2× typical display width where useful). */
export const STOREFRONT_IMAGE_PRESETS = {
  productCard: { width: 640, quality: 80, resize: "contain" },
  collectionCard: { width: 960, quality: 80, resize: "contain" },
  collectionScroller: { width: 480, quality: 80, resize: "contain" },
  collectionSeo: { width: 960, quality: 80, resize: "contain" },
  hero: { width: 1920, quality: 80, resize: "contain" },
  review: { width: 900, quality: 80, resize: "contain" },
  /** Homepage / listing review tiles — modal keeps `review`. */
  reviewGrid: { width: 480, quality: 75, resize: "contain" },
  reviewThumb: { width: 160, quality: 75, resize: "contain" },
  avatar: { width: 96, height: 96, quality: 75, resize: "cover" },
  paymentIcon: { width: 96, quality: 80, resize: "contain" },
  galleryThumb: { width: 220, quality: 75, resize: "contain" },
  cartThumb: { width: 128, quality: 75, resize: "contain" },
  editorial: { width: 1200, quality: 80, resize: "contain" },
  editorialThumb: { width: 256, height: 256, quality: 75, resize: "cover" },
  articleCard: { width: 800, height: 600, quality: 80, resize: "cover" },
  trustIcon: { width: 96, quality: 80, resize: "contain" },
} as const satisfies Record<string, SupabaseTransformOptions>;

export type StorefrontImagePreset = keyof typeof STOREFRONT_IMAGE_PRESETS;

const OBJECT_PUBLIC_MARKER = "/storage/v1/object/public/";
const RENDER_PUBLIC_MARKER = "/storage/v1/render/image/public/";

function clampDimension(value: number | undefined): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  if (n < 1 || n > 2500) return undefined;
  return n;
}

function clampQuality(value: number | undefined): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  if (n < 20 || n > 100) return undefined;
  return n;
}

/** True when `src` points at Supabase public Storage (object or render). */
export function isSupabasePublicStorageUrl(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) return false;
  try {
    const url = new URL(src);
    return (
      url.hostname.endsWith(".supabase.co") &&
      (url.pathname.includes(OBJECT_PUBLIC_MARKER) ||
        url.pathname.includes(RENDER_PUBLIC_MARKER))
    );
  } catch {
    return false;
  }
}

/**
 * Rewrite a public Storage object URL to a transform (render) URL.
 * Non-Supabase / local paths are returned unchanged.
 */
export function getSupabaseTransformUrl(
  src: string,
  options: SupabaseTransformOptions = {},
): string {
  if (!src || !isSupabasePublicStorageUrl(src)) return src;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  if (url.pathname.includes(OBJECT_PUBLIC_MARKER)) {
    url.pathname = url.pathname.replace(
      OBJECT_PUBLIC_MARKER,
      RENDER_PUBLIC_MARKER,
    );
  }

  // Drop prior transform query; rebuild from options.
  url.search = "";

  const width = clampDimension(options.width);
  const height = clampDimension(options.height);
  const quality = clampQuality(options.quality);

  if (width != null) url.searchParams.set("width", String(width));
  if (height != null) url.searchParams.set("height", String(height));
  if (quality != null) url.searchParams.set("quality", String(quality));
  if (options.resize) url.searchParams.set("resize", options.resize);

  return url.toString();
}

export function getStorefrontImageUrl(
  src: string,
  preset: StorefrontImagePreset,
  overrides?: SupabaseTransformOptions,
): string {
  return getSupabaseTransformUrl(src, {
    ...STOREFRONT_IMAGE_PRESETS[preset],
    ...overrides,
  });
}
