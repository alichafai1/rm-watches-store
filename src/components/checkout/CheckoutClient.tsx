"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AddressFieldset } from "@/components/checkout/AddressFieldset";
import { CheckoutChoiceRow } from "@/components/checkout/CheckoutChoiceRow";
import {
  CheckoutField,
  checkoutControlClassName,
} from "@/components/checkout/CheckoutField";
import { CheckoutSectionCard } from "@/components/checkout/CheckoutSectionCard";
import { CheckoutSecureBadge } from "@/components/checkout/CheckoutTrustBadges";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentIconStrip } from "@/components/checkout/PaymentIconStrip";
import { useCart } from "@/components/cart/useCart";
import { Container } from "@/components/ui/Container";
import {
  checkoutPaymentOptions,
  checkoutShippingOptions,
} from "@/constants/checkout";
import { defaultCountryCode } from "@/constants/countries";
import {
  createEmptyAddress,
  validateCheckoutForm,
  type CheckoutAddress,
  type CheckoutErrors,
  type CheckoutFormValues,
} from "@/lib/checkout/validate";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format-price";

const initialValues: CheckoutFormValues = {
  ...createEmptyAddress(defaultCountryCode),
  billing: createEmptyAddress(defaultCountryCode),
  billingSameAsShipping: true,
  email: "",
  emailOffers: false,
  paymentOptionId: checkoutPaymentOptions[0]?.id ?? "",
  phone: "",
  shippingOptionId: checkoutShippingOptions[0]?.id ?? "",
};

export function CheckoutClient() {
  const { currency, isHydrated, items, removeItem, subtotal, updateQuantity } =
    useCart();

  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [invalidNonce, setInvalidNonce] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const shippingOption =
    checkoutShippingOptions.find(
      (option) => option.id === values.shippingOptionId,
    ) ?? checkoutShippingOptions[0];
  const shippingCost = shippingOption?.price ?? 0;
  const total = Math.round((subtotal + shippingCost) * 100) / 100;

  useEffect(() => {
    if (!invalidNonce) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [invalidNonce]);

  function setField<Key extends keyof CheckoutFormValues>(
    field: Key,
    value: CheckoutFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  }

  function setShippingAddressField(field: keyof CheckoutAddress, value: string) {
    setField(field, value);
  }

  function setBillingAddressField(field: keyof CheckoutAddress, value: string) {
    setValues((current) => ({
      ...current,
      billing: { ...current.billing, [field]: value },
    }));
    setErrors((current) => {
      const key = `billing.${field}`;
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCheckoutForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setHasSubmitted(false);
      setInvalidNonce((current) => current + 1);
      return;
    }

    setHasSubmitted(true);
  }

  if (!isHydrated) {
    return (
      <CheckoutShell>
        <div className="grid gap-4" role="status">
          <span className="sr-only">Loading your order</span>
          <div className="h-32 animate-pulse rounded-2xl bg-neutral-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
        </div>
      </CheckoutShell>
    );
  }

  if (items.length === 0) {
    return (
      <CheckoutShell>
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-[var(--shadow-xs)]">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Your cart is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Add a watch to your cart and it will appear here, ready to check out.
          </p>
          <Link
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-[#9a752e] bg-[#9a752e] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:border-[#866432] hover:bg-[#866432]"
            href="/shop"
          >
            Continue Shopping
          </Link>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
        <aside className="order-first lg:order-last lg:sticky lg:top-6">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[var(--shadow-xs)]">
            <button
              aria-controls="order-summary-panel"
              aria-expanded={isSummaryOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 lg:hidden"
              onClick={() => setIsSummaryOpen((current) => !current)}
              type="button"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-[#9a752e]">
                <BagIcon />
                {isSummaryOpen ? "Hide order summary" : "Show order summary"}
                <ChevronIcon isOpen={isSummaryOpen} />
              </span>
              <span className="text-base font-semibold text-neutral-950">
                {formatPrice(total, currency)}
              </span>
            </button>

            <div
              className={cn(
                "border-t border-neutral-200 px-5 py-6 sm:px-6 lg:block lg:border-t-0 lg:p-7",
                isSummaryOpen ? "block" : "hidden",
              )}
              id="order-summary-panel"
            >
              <h2 className="mb-5 hidden text-lg font-semibold tracking-tight text-neutral-950 lg:block">
                Order summary
              </h2>
              <OrderSummary
                currency={currency}
                items={items}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
                shippingCost={shippingCost}
                subtotal={subtotal}
              />
            </div>
          </div>
        </aside>

        <form className="grid gap-6" noValidate onSubmit={handleSubmit} ref={formRef}>
          <CheckoutSectionCard
            action={
              <Link
                className="text-[13px] text-neutral-500 underline-offset-4 hover:text-neutral-950 hover:underline"
                href="/shop"
              >
                Continue shopping
              </Link>
            }
            description="We'll send your order confirmation and tracking details here."
            title="Contact"
          >
            <div className="grid gap-4">
              <CheckoutField
                error={errors.email}
                htmlFor="checkout-email"
                label="Email address"
              >
                <input
                  aria-describedby={errors.email ? "checkout-email-error" : undefined}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className={checkoutControlClassName(Boolean(errors.email))}
                  id="checkout-email"
                  inputMode="email"
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={values.email}
                />
              </CheckoutField>
              <label className="flex items-start gap-2.5 text-sm text-neutral-600">
                <input
                  checked={values.emailOffers}
                  className="mt-0.5 size-4 rounded border-neutral-300 accent-[#9a752e]"
                  onChange={(event) => setField("emailOffers", event.target.checked)}
                  type="checkbox"
                />
                <span>Email me with news and exclusive offers</span>
              </label>
            </div>
          </CheckoutSectionCard>

          <CheckoutSectionCard
            description="Enter the address where the watch should arrive."
            title="Delivery"
          >
            <div className="grid gap-4">
              <AddressFieldset
                errors={errors}
                idPrefix="shipping"
                onChange={setShippingAddressField}
                value={values}
              />
              <CheckoutField
                error={errors.phone}
                htmlFor="shipping-phone"
                label="Phone"
              >
                <input
                  aria-describedby={errors.phone ? "shipping-phone-error" : undefined}
                  aria-invalid={Boolean(errors.phone)}
                  autoComplete="tel"
                  className={checkoutControlClassName(Boolean(errors.phone))}
                  id="shipping-phone"
                  inputMode="tel"
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="For delivery updates"
                  type="tel"
                  value={values.phone}
                />
              </CheckoutField>
            </div>
          </CheckoutSectionCard>

          <CheckoutSectionCard title="Shipping method">
            <div className="grid gap-3">
              {checkoutShippingOptions.map((option) => (
                <CheckoutChoiceRow
                  checked={values.shippingOptionId === option.id}
                  description={option.description}
                  id={`shipping-option-${option.id}`}
                  key={option.id}
                  label={option.label}
                  name="shippingOption"
                  onSelect={() => setField("shippingOptionId", option.id)}
                  trailing={
                    option.badge ? (
                      <span className="inline-flex items-center rounded-full border border-[#e2d3b4] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9a752e]">
                        {option.badge}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-950">
                        {formatPrice(option.price, currency)}
                      </span>
                    )
                  }
                  value={option.id}
                />
              ))}
            </div>
          </CheckoutSectionCard>

          <CheckoutSectionCard
            description="All transactions are secure and encrypted."
            title="Payment method"
          >
            <div className="grid gap-3">
              {checkoutPaymentOptions.map((option) => (
                <CheckoutChoiceRow
                  checked={values.paymentOptionId === option.id}
                  // Six logos beside the label overflow a phone, so they drop
                  // to their own line below it and sit inline from sm up.
                  footer={
                    <PaymentIconStrip className="justify-start sm:hidden" compact />
                  }
                  id={`payment-option-${option.id}`}
                  key={option.id}
                  label={option.label}
                  name="paymentOption"
                  onSelect={() => setField("paymentOptionId", option.id)}
                  trailing={<PaymentIconStrip className="hidden sm:flex" compact />}
                  value={option.id}
                />
              ))}
            </div>
          </CheckoutSectionCard>

          <CheckoutSectionCard title="Billing address">
            <div className="grid gap-3">
              <CheckoutChoiceRow
                checked={values.billingSameAsShipping}
                id="billing-same"
                label="Same as shipping address"
                name="billingAddressMode"
                onSelect={() => setField("billingSameAsShipping", true)}
                value="same"
              />
              <CheckoutChoiceRow
                checked={!values.billingSameAsShipping}
                id="billing-different"
                label="Use a different billing address"
                name="billingAddressMode"
                onSelect={() => setField("billingSameAsShipping", false)}
                value="different"
              />
              {values.billingSameAsShipping ? null : (
                <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                  <AddressFieldset
                    errors={errors}
                    idPrefix="billing"
                    onChange={setBillingAddressField}
                    value={values.billing}
                  />
                </div>
              )}
            </div>
          </CheckoutSectionCard>

          <div className="grid gap-5">
            {hasSubmitted ? (
              <div
                className="rounded-xl border border-[#e2d3b4] bg-[#f8f2e8] px-4 py-3.5 text-sm leading-6 text-[#6f5520]"
                role="status"
              >
                Your details look good. Online payment is not connected to this
                store yet, so the order can&apos;t be completed here.
              </div>
            ) : null}

            <button
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-[#9a752e] bg-[#9a752e] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:border-[#866432] hover:bg-[#866432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a752e] focus-visible:ring-offset-2"
              type="submit"
            >
              Pay Now &middot; {formatPrice(total, currency)}
            </button>

            <CheckoutSecureBadge />

            <p className="text-center text-[13px] leading-6 text-neutral-500">
              By placing your order you agree to our{" "}
              <Link className="underline underline-offset-4" href="/terms-of-service">
                Terms of Service
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" href="/refund-return-policy">
                Refund &amp; Return Policy
              </Link>{" "}
              and{" "}
              <Link className="underline underline-offset-4" href="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-50 py-8 sm:py-12">
      <Container size="xl">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a752e]">
            Secure Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Checkout
          </h1>
        </div>
        {children}
      </Container>
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path d="M6 7h12l-1 14H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
