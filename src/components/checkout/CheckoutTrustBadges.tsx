import Image from "next/image";
import { PaymentIconStrip } from "@/components/checkout/PaymentIconStrip";
import { trustAssurances } from "@/constants/trust-assurances";

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 text-[#9a752e]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="11" rx="2" width="14" x="5" y="11" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/** Lock line plus the accepted card and wallet logos, shown under Pay now. */
export function CheckoutSecureBadge() {
  return (
    <div className="grid gap-3">
      <p className="flex items-center justify-center gap-1.5 text-xs font-medium tracking-[0.04em] text-neutral-600 sm:text-[13px]">
        <LockIcon />
        <span>Guaranteed safe &amp; secure checkout</span>
      </p>
      <PaymentIconStrip />
    </div>
  );
}

/** Shipping, returns, and secure-payment reassurances in a compact stack. */
export function CheckoutAssuranceList() {
  return (
    <ul className="grid gap-3">
      {trustAssurances.map((item) => (
        <li className="flex items-center gap-3" key={item.id}>
          <span className="relative block size-9 shrink-0">
            <Image
              alt={item.iconAlt}
              className="object-contain object-center"
              fill
              sizes="36px"
              src={item.iconSrc}
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold leading-5 text-neutral-950">
              {item.title}
            </span>
            <span className="block text-[13px] leading-5 text-neutral-500">
              {item.description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
