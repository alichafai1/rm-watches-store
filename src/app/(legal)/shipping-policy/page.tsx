import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping Policy",
  description:
    "Learn how RM Watches Store processes orders, shipping times, tracking, customs fees, and damaged packages.",
  pathname: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shipping Policy", href: "/shipping-policy" },
      ])}
      title="Shipping Policy"
    >
      <h2>Order Processing</h2>
      <p>
        Thank you for choosing our store. We carefully prepare every order to
        ensure your watch arrives safely and securely.
      </p>
      <p>
        Orders are processed within <strong>1–3 business days</strong> after
        payment confirmation. Orders placed during weekends or public holidays
        will be processed on the next business day.
      </p>
      <p>
        You will receive a confirmation email with your order details once your
        purchase has been completed.
      </p>

      <h2>Shipping Time</h2>
      <p>
        Delivery times may vary depending on your location and shipping method
        selected at checkout.
      </p>
      <p>Estimated delivery times:</p>
      <ul>
        <li>United States: 5–10 business days</li>
        <li>Canada: 7–14 business days</li>
        <li>Europe: 5–12 business days</li>
        <li>International Orders: 7–20 business days</li>
      </ul>
      <p>
        Please note that delivery times are estimates and may be affected by
        customs processing, weather conditions, carrier delays, or other
        circumstances outside our control.
      </p>

      <h2>Tracking Information</h2>
      <p>
        Once your order has been shipped, you will receive a shipping
        confirmation email containing your tracking number.
      </p>
      <p>
        Tracking information may take 24–72 hours to update after shipment.
      </p>

      <h2>Customs, Duties & Taxes</h2>
      <p>
        International customers are responsible for any customs fees, import
        duties, or local taxes that may apply to their order.
      </p>
      <p>
        These charges are determined by your country&apos;s customs authority
        and are not included in the purchase price or shipping cost.
      </p>

      <h2>Lost or Damaged Packages</h2>
      <p>
        We are not responsible for packages that are delayed, lost, or damaged
        after they have been confirmed as delivered by the shipping carrier.
      </p>
      <p>
        If your package arrives damaged, please contact us within 48 hours of
        delivery with photos of the package and product so our team can assist
        you.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions regarding your shipment, please contact our
        customer support team.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:ali2006@gmail.com">ali2006@gmail.com</a>
      </p>
    </PolicyPage>
  );
}
