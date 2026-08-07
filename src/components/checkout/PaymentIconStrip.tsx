import { StorefrontImage } from "@/components/media/StorefrontImage";
import { paymentIconUrl, paymentMethods } from "@/constants/payment-methods";
import { cn } from "@/lib/utils/cn";

type PaymentIconStripProps = {
  className?: string;
  /** Narrow rows (like the payment option) show fewer icons on small screens. */
  compact?: boolean;
};

export function PaymentIconStrip({
  className,
  compact = false,
}: PaymentIconStripProps) {
  return (
    <ul
      aria-label="Accepted payment methods"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1.5",
        compact ? "justify-end" : "justify-center gap-x-2.5",
        className,
      )}
    >
      {paymentMethods.map((method) => (
        <li
          // The source logos have very different aspect ratios, so each one is
          // fitted into an identical box instead of being sized by its width.
          className={cn(
            "flex items-center justify-center",
            compact ? "h-6 w-10 sm:h-7 sm:w-11" : "h-7 w-11 sm:h-8 sm:w-12",
          )}
          key={method.name}
          title={method.name}
        >
          <StorefrontImage
            alt={method.name}
            className="pointer-events-none size-full select-none object-contain"
            draggable={false}
            height={28}
            preset="paymentIcon"
            sizes="48px"
            src={paymentIconUrl(method.path)}
            width={48}
          />
        </li>
      ))}
    </ul>
  );
}
