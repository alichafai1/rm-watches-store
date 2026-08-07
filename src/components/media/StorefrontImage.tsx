import Image, { type ImageProps } from "next/image";
import {
  getStorefrontImageUrl,
  getSupabaseTransformUrl,
  isSupabasePublicStorageUrl,
  type StorefrontImagePreset,
  type SupabaseTransformOptions,
} from "@/lib/images/supabase-transform";

type StorefrontImageProps = Omit<ImageProps, "loader" | "unoptimized" | "src"> & {
  src: string;
  /**
   * Named transform size. Ignored when `original` is true.
   * Non-Supabase src values (local `/images/...`) are left unchanged.
   */
  preset?: StorefrontImagePreset;
  /** Serve the Storage object URL as-is (PDP gallery / zoom). */
  original?: boolean;
  /** Extra transform params merged over the preset. */
  transform?: SupabaseTransformOptions;
};

/**
 * Storefront media that bypasses Vercel Image Optimization and uses Supabase
 * transforms (or the original object URL) instead.
 */
export function StorefrontImage({
  src,
  preset,
  original = false,
  transform,
  alt,
  ...rest
}: StorefrontImageProps) {
  let resolvedSrc = src;

  if (!original && isSupabasePublicStorageUrl(src)) {
    resolvedSrc = preset
      ? getStorefrontImageUrl(src, preset, transform)
      : getSupabaseTransformUrl(src, transform ?? { width: 800, quality: 80 });
  }

  return <Image alt={alt} src={resolvedSrc} unoptimized {...rest} />;
}
