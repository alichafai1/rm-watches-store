import { cn } from "@/lib/utils/cn";

type GalleryArrowProps = {
  className?: string;
  direction: "next" | "previous";
  label: string;
  onClick: () => void;
  /** `onImage` sits on the white product frame, `onOverlay` on the dark viewer. */
  tone?: "onImage" | "onOverlay";
};

const toneClassName: Record<NonNullable<GalleryArrowProps["tone"]>, string> = {
  onImage:
    "gallery-arrow bg-white/85 text-neutral-900 ring-1 ring-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:bg-white",
  onOverlay: "bg-white/12 text-white ring-1 ring-white/20 hover:bg-white/22",
};

export function GalleryArrow({
  className,
  direction,
  label,
  onClick,
  tone = "onImage",
}: GalleryArrowProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:size-11",
        direction === "previous" ? "left-2 sm:left-3" : "right-2 sm:right-3",
        toneClassName[tone],
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className={cn("size-5", direction === "next" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
      >
        <path d="m14 6-6 6 6 6" />
      </svg>
    </button>
  );
}
