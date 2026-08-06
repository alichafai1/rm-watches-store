import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contactInfo } from "@/constants/contact";
import { siteConfig } from "@/constants/site";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about PATARA LLC and RM Watches Store — premium Richard Mille replica and super clone watches with detailed guides and dedicated support.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <Container>
      <Section>
        <div className="grid gap-10">
          <PageHeader
            breadcrumbs={createBreadcrumbs([
              { label: "About", href: "/about" },
            ])}
            description="Premium replica watches, careful curation, and support you can count on."
            title="About Us"
          />

          <div className="article-content grid max-w-3xl gap-6 text-base leading-7 text-neutral-700">
            <p>
              Welcome to {siteConfig.name}, operated by{" "}
              <strong className="font-medium text-neutral-900">
                {contactInfo.companyName}
              </strong>
              . We specialize in high-quality Richard Mille replica and super
              clone watches for collectors and enthusiasts who want striking
              design, solid craftsmanship, and clear product information —
              without the ultra-luxury price tag.
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              What we offer
            </h2>
            <p>
              Our catalog focuses on popular RM models and new arrivals,
              presented with detailed photos, specifications, and buying guides
              so you can compare finishes, materials, and styles with
              confidence. From skeleton tourbillons to everyday wear pieces, we
              aim to make discovering the right watch straightforward.
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              Our approach
            </h2>
            <p>
              We care about the details that matter on the wrist: finishing,
              proportions, and overall wearability. Alongside the shop, we
              publish practical guides and articles to help you understand
              quality differences, popular models, and what to look for before
              you buy.
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              Customer support
            </h2>
            <p>
              Questions about an order, shipping, or a specific model? Our team
              is available around the clock. Reach us anytime through our{" "}
              <Link
                className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                href="/contact"
              >
                contact page
              </Link>
              , or email{" "}
              <a
                className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                href={contactInfo.emailHref}
              >
                {contactInfo.email}
              </a>
              .
            </p>

            <div className="mt-2 border-t border-neutral-200 pt-8">
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                Operated by
              </p>
              <p className="mt-2 text-neutral-900">
                {contactInfo.companyName}
              </p>
              <address className="mt-1 not-italic text-neutral-600">
                {contactInfo.addressLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
