import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ImagePlaceholderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  ratio?: "square" | "wide" | "portrait";
};

const ratioClassName: Record<NonNullable<ImagePlaceholderProps["ratio"]>, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

export function ImagePlaceholder({
  className,
  label = "Image placeholder",
  ratio = "square",
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "grid w-full place-items-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-500",
        ratioClassName[ratio],
        className,
      )}
      role="img"
      {...props}
    >
      {label}
    </div>
  );
}
