import Image from "next/image";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils/cn";

/** Intrinsic size of the artwork in public/images/brand/logo.png. */
const LOGO_WIDTH = 850;
const LOGO_HEIGHT = 253;

type LogoProps = {
  className?: string;
  /** Widths the logo renders at, so the optimizer serves a small file. */
  sizes?: string;
  /** Set on the header logo, which is above the fold. */
  priority?: boolean;
};

export function Logo({ className, priority = false, sizes }: LogoProps) {
  return (
    <Image
      alt={siteConfig.name}
      className={cn("w-auto object-contain", className)}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes={sizes}
      src="/images/brand/logo.png"
      unoptimized
      width={LOGO_WIDTH}
    />
  );
}
