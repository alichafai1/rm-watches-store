import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { siteConfig } from "@/constants/site";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}, explaining how we collect, use, store, and protect your personal information.`,
  pathname: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Privacy Policy", href: "/privacy-policy" },
      ])}
      title="Privacy Policy"
    >
      <h2>Overview</h2>
      <p>
        At {siteConfig.name}, we respect your privacy and are committed to
        protecting your personal information. This Privacy Policy explains how
        we collect, use, store, and protect your information when you visit our
        website or make a purchase.
      </p>
      <p>
        By using our website, you agree to the practices described in this
        Privacy Policy.
      </p>

      <h2>Information We Collect</h2>
      <p>
        When you visit our website, place an order, or contact us, we may
        collect the following information:
      </p>

      <h3>Personal Information</h3>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Shipping and billing address</li>
        <li>Payment information</li>
        <li>Order details</li>
      </ul>

      <h3>Automatically Collected Information</h3>
      <p>
        When you browse our website, we may automatically collect certain
        information, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device information</li>
        <li>Pages visited</li>
        <li>Time spent on our website</li>
        <li>Website usage data</li>
      </ul>
      <p>
        This information helps us improve our website performance and customer
        experience.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We may use your information for the following purposes:</p>
      <ul>
        <li>Processing and fulfilling your orders</li>
        <li>Providing customer support</li>
        <li>Sending order updates and notifications</li>
        <li>Improving our products and services</li>
        <li>Personalizing your shopping experience</li>
        <li>Preventing fraud and unauthorized transactions</li>
        <li>Complying with legal obligations</li>
      </ul>

      <h2>Payment Information</h2>
      <p>
        All payment transactions are processed securely through trusted
        third-party payment providers.
      </p>
      <p>
        We do not store or have access to your complete payment card
        information. Payment providers handle payment processing according to
        their own privacy and security policies.
      </p>

      <h2>Sharing Your Information</h2>
      <p>
        We may share your information only when necessary to provide our
        services, including:
      </p>
      <ul>
        <li>Shipping companies to deliver your orders</li>
        <li>Payment processors to complete transactions</li>
        <li>Service providers that help us operate our website</li>
        <li>Legal authorities when required by law</li>
      </ul>
      <p>
        We do not sell, rent, or trade your personal information to third
        parties.
      </p>

      <h2>Cookies</h2>
      <p>
        Our website uses cookies and similar technologies to improve your
        browsing experience.
      </p>
      <p>Cookies help us:</p>
      <ul>
        <li>Remember your preferences</li>
        <li>Understand website traffic</li>
        <li>Improve website functionality</li>
        <li>Provide relevant content</li>
      </ul>
      <p>
        You can control or disable cookies through your browser settings.
        However, some website features may not function properly without
        cookies.
      </p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect your personal information from
        unauthorized access, misuse, or disclosure.
      </p>
      <p>
        However, no method of online transmission or electronic storage is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Request access to your personal information</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal data</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p>
        To make a request, please contact us using the information below.
      </p>

      <h2>Marketing Communications</h2>
      <p>
        With your permission, we may send you promotional emails, product
        updates, and special offers.
      </p>
      <p>
        You can unsubscribe from marketing emails at any time by clicking the
        unsubscribe link included in our emails.
      </p>

      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites.</p>
      <p>
        We are not responsible for the privacy practices or content of external
        websites. We encourage you to review their privacy policies before
        providing personal information.
      </p>

      <h2>Policy Updates</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, services, or legal requirements.
      </p>
      <p>
        Any updates will be posted on this page with the revised date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle
        your information, please contact us:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:ali2006@gmail.com">ali2006@gmail.com</a>
      </p>
    </PolicyPage>
  );
}
