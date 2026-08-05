import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { siteConfig } from "@/constants/site";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}, covering website use, orders, payments, pricing, and liability.`,
  pathname: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Terms of Service", href: "/terms-of-service" },
      ])}
      title="Terms of Service"
    >
      <p>
        Welcome to {siteConfig.name}. By accessing or using our website, you
        agree to comply with these Terms of Service.
      </p>

      <h2>Website Use</h2>
      <p>
        You agree to use this website only for lawful purposes and in accordance
        with these terms.
      </p>
      <p>
        You may not use our website for fraudulent activities, unauthorized
        access, or any activity that may damage our services.
      </p>

      <h2>Product Information</h2>
      <p>
        We make every effort to provide accurate product descriptions, images,
        specifications, and pricing information.
      </p>
      <p>
        However, slight variations may occur due to differences in displays,
        lighting, or manufacturing processes.
      </p>

      <h2>Orders & Payments</h2>
      <p>By placing an order, you agree that:</p>
      <ul>
        <li>All information provided during checkout is accurate.</li>
        <li>You are authorized to use the selected payment method.</li>
        <li>
          We reserve the right to refuse or cancel orders due to suspected
          fraud, pricing errors, or inventory issues.
        </li>
      </ul>

      <h2>Pricing</h2>
      <p>Prices displayed on our website may change without notice.</p>
      <p>
        Any applicable taxes, duties, or additional fees are the responsibility
        of the customer unless otherwise stated.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All website content, including images, text, logos, graphics, and
        designs, is owned by or licensed to {siteConfig.name}.
      </p>
      <p>
        Unauthorized use, reproduction, or distribution of our content is
        prohibited.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        We are not responsible for indirect damages, delays, or losses caused by
        circumstances beyond our reasonable control, including shipping delays,
        technical issues, or third-party services.
      </p>

      <h2>Privacy</h2>
      <p>
        Your privacy is important to us. Please review our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> to understand how we
        collect and use your information.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to update these Terms of Service at any time.
        Changes will become effective immediately after being posted on this
        page.
      </p>

      <h2>Contact Information</h2>
      <p>If you have any questions about these Terms, please contact:</p>
      <p>
        Email:{" "}
        <a href="mailto:ali2006@gmail.com">ali2006@gmail.com</a>
      </p>
    </PolicyPage>
  );
}
