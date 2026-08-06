import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contactInfo } from "@/constants/contact";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with PATARA LLC. Email, phone, and mailing address for RM Watches Store customer support — available 24/7.",
  pathname: "/contact",
});

export default function ContactPage() {
  return (
    <Container>
      <Section>
        <div className="grid gap-10">
          <PageHeader
            breadcrumbs={createBreadcrumbs([
              { label: "Contact", href: "/contact" },
            ])}
            description={contactInfo.supportNote}
            title="Contact Us"
          />

          <div className="grid max-w-2xl gap-8 text-base leading-7 text-neutral-700">
            <p>
              Have a question about a watch, your order, or shipping? Reach out
              anytime — we respond around the clock so you can shop with
              confidence.
            </p>

            <dl className="grid gap-6 border-t border-neutral-200 pt-8">
              <div className="grid gap-1">
                <dt className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  Company
                </dt>
                <dd className="text-neutral-900">{contactInfo.companyName}</dd>
              </div>

              <div className="grid gap-1">
                <dt className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  Address
                </dt>
                <dd className="text-neutral-900">
                  <address className="not-italic">
                    {contactInfo.addressLines.map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>

              <div className="grid gap-1">
                <dt className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  Phone
                </dt>
                <dd>
                  <a
                    className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                    href={contactInfo.phoneHref}
                  >
                    {contactInfo.phone}
                  </a>
                </dd>
              </div>

              <div className="grid gap-1">
                <dt className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  Email
                </dt>
                <dd>
                  <a
                    className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                    href={contactInfo.emailHref}
                  >
                    {contactInfo.email}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="border-t border-neutral-200 pt-8 text-neutral-600">
              Prefer email? Write to{" "}
              <a
                className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                href={contactInfo.emailHref}
              >
                {contactInfo.email}
              </a>{" "}
              and our 24/7 support team will get back to you as soon as
              possible.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
