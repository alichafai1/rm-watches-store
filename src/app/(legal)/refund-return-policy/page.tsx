import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Refund & Return Policy",
  description:
    "Learn how to return a watch from RM Watches Store, including return periods, refunds, shipping costs, and exchanges.",
  pathname: "/refund-return-policy",
});

export default function RefundReturnPolicyPage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Refund & Return Policy", href: "/refund-return-policy" },
      ])}
      title="Refund & Return Policy"
    >
      <p>
        We want you to be completely satisfied with your purchase. If you are
        not satisfied with your order, please review our return and refund
        policy below.
      </p>

      <h2>Return Period</h2>
      <p>
        Customers may request a return within <strong>14 days</strong> of
        receiving their order.
      </p>
      <p>To be eligible for a return:</p>
      <ul>
        <li>The watch must be unused and in the same condition as received.</li>
        <li>
          The original packaging, accessories, and documentation must be
          included.
        </li>
        <li>
          The item must not show signs of wear, damage, or modification.
        </li>
      </ul>

      <h2>Return Process</h2>
      <p>
        To request a return, please contact our customer service team with:
      </p>
      <ul>
        <li>Order number</li>
        <li>Reason for return</li>
        <li>Photos of the product (if applicable)</li>
      </ul>
      <p>
        Our team will review your request and provide return instructions if
        approved.
      </p>
      <p>Please do not send items back without contacting us first.</p>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect your returned item, we will notify you
        about the approval or rejection of your refund.
      </p>
      <p>
        Approved refunds will be processed to the original payment method within{" "}
        <strong>5–10 business days</strong>.
      </p>
      <p>
        Please note that your bank or payment provider may require additional
        time to display the refund.
      </p>

      <h2>Shipping Costs</h2>
      <p>
        Original shipping fees are non-refundable unless the item received was
        incorrect, defective, or damaged upon arrival.
      </p>
      <p>
        Customers are responsible for return shipping costs unless the return is
        due to an error on our part.
      </p>

      <h2>Exchanges</h2>
      <p>
        If you receive a defective or incorrect item, please contact us within
        48 hours of delivery. We will review your request and provide
        assistance.
      </p>

      <h2>Non-Returnable Items</h2>
      <p>Returns may not be accepted for:</p>
      <ul>
        <li>Items damaged through customer use</li>
        <li>Items without original packaging</li>
        <li>Customized products</li>
        <li>Products returned after the return period</li>
      </ul>

      <h2>Contact Us</h2>
      <p>For any return or refund questions, please contact:</p>
      <p>
        Email:{" "}
        <a href="mailto:ali2006@gmail.com">ali2006@gmail.com</a>
      </p>
    </PolicyPage>
  );
}
