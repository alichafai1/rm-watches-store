"use client";

import {
  CheckoutField,
  checkoutControlClassName,
} from "@/components/checkout/CheckoutField";
import { countries } from "@/constants/countries";
import type { CheckoutAddress, CheckoutErrors } from "@/lib/checkout/validate";

type AddressFieldsetProps = {
  errors: CheckoutErrors;
  /** Namespaces field ids and error keys so shipping and billing can coexist. */
  idPrefix: string;
  onChange: (field: keyof CheckoutAddress, value: string) => void;
  value: CheckoutAddress;
};

export function AddressFieldset({
  errors,
  idPrefix,
  onChange,
  value,
}: AddressFieldsetProps) {
  const fieldId = (field: string) => `${idPrefix}-${field}`;
  const errorFor = (field: keyof CheckoutAddress) =>
    errors[idPrefix === "shipping" ? field : `billing.${field}`];

  function describedBy(field: keyof CheckoutAddress) {
    return errorFor(field) ? `${fieldId(field)}-error` : undefined;
  }

  return (
    <div className="grid gap-4">
      <CheckoutField
        error={errorFor("country")}
        htmlFor={fieldId("country")}
        label="Country / Region"
      >
        <select
          aria-describedby={describedBy("country")}
          aria-invalid={Boolean(errorFor("country"))}
          autoComplete="country"
          className={checkoutControlClassName(Boolean(errorFor("country")))}
          id={fieldId("country")}
          onChange={(event) => onChange("country", event.target.value)}
          value={value.country}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </CheckoutField>

      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutField
          error={errorFor("firstName")}
          htmlFor={fieldId("firstName")}
          label="First name"
        >
          <input
            aria-describedby={describedBy("firstName")}
            aria-invalid={Boolean(errorFor("firstName"))}
            autoComplete="given-name"
            className={checkoutControlClassName(Boolean(errorFor("firstName")))}
            id={fieldId("firstName")}
            onChange={(event) => onChange("firstName", event.target.value)}
            value={value.firstName}
          />
        </CheckoutField>
        <CheckoutField
          error={errorFor("lastName")}
          htmlFor={fieldId("lastName")}
          label="Last name"
        >
          <input
            aria-describedby={describedBy("lastName")}
            aria-invalid={Boolean(errorFor("lastName"))}
            autoComplete="family-name"
            className={checkoutControlClassName(Boolean(errorFor("lastName")))}
            id={fieldId("lastName")}
            onChange={(event) => onChange("lastName", event.target.value)}
            value={value.lastName}
          />
        </CheckoutField>
      </div>

      <CheckoutField
        error={errorFor("address")}
        htmlFor={fieldId("address")}
        label="Address"
      >
        <input
          aria-describedby={describedBy("address")}
          aria-invalid={Boolean(errorFor("address"))}
          autoComplete="address-line1"
          className={checkoutControlClassName(Boolean(errorFor("address")))}
          id={fieldId("address")}
          onChange={(event) => onChange("address", event.target.value)}
          placeholder="Street and house number"
          value={value.address}
        />
      </CheckoutField>

      <CheckoutField
        htmlFor={fieldId("apartment")}
        label="Apartment, suite, etc."
        optional
      >
        <input
          autoComplete="address-line2"
          className={checkoutControlClassName()}
          id={fieldId("apartment")}
          onChange={(event) => onChange("apartment", event.target.value)}
          value={value.apartment}
        />
      </CheckoutField>

      <div className="grid gap-4 sm:grid-cols-3">
        <CheckoutField
          error={errorFor("city")}
          htmlFor={fieldId("city")}
          label="City"
        >
          <input
            aria-describedby={describedBy("city")}
            aria-invalid={Boolean(errorFor("city"))}
            autoComplete="address-level2"
            className={checkoutControlClassName(Boolean(errorFor("city")))}
            id={fieldId("city")}
            onChange={(event) => onChange("city", event.target.value)}
            value={value.city}
          />
        </CheckoutField>
        <CheckoutField
          htmlFor={fieldId("state")}
          label="State / Province"
          optional
        >
          <input
            autoComplete="address-level1"
            className={checkoutControlClassName()}
            id={fieldId("state")}
            onChange={(event) => onChange("state", event.target.value)}
            value={value.state}
          />
        </CheckoutField>
        <CheckoutField
          error={errorFor("postalCode")}
          htmlFor={fieldId("postalCode")}
          label="Postal code"
        >
          <input
            aria-describedby={describedBy("postalCode")}
            aria-invalid={Boolean(errorFor("postalCode"))}
            autoComplete="postal-code"
            className={checkoutControlClassName(Boolean(errorFor("postalCode")))}
            id={fieldId("postalCode")}
            onChange={(event) => onChange("postalCode", event.target.value)}
            value={value.postalCode}
          />
        </CheckoutField>
      </div>
    </div>
  );
}
