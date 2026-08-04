import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

export function FinalCtaSection() {
  return (
    <Section ariaLabelledBy="final-cta-heading" className="bg-white" spacing="lg">
      <Container>
        <div className="grid overflow-hidden rounded-2xl bg-neutral-950 text-white lg:grid-cols-[1fr_0.8fr]">
          <div className="grid content-center gap-6 p-6 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d6bd7f]">
              Ready to browse
            </p>
            <div className="grid gap-3">
              <Typography
                as="h2"
                className="text-white"
                id="final-cta-heading"
                variant="h2"
              >
                Find Your Perfect Watch
              </Typography>
              <p className="max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
                Browse the full collection and discover a watch that matches
                your style and everyday needs.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton
                className="home-cta-accent"
                href="/shop"
              >
                Shop All Watches
              </LinkButton>
              <LinkButton
                className="home-cta-outline-dark"
                href="/collections"
                variant="outline"
              >
                View Collections
              </LinkButton>
            </div>
          </div>
          <div className="bg-white/[0.03] p-4 lg:p-6">
            <Image
              alt="Large watch placeholder for final homepage call to action"
              className="aspect-[4/3] h-full w-full rounded-xl object-cover opacity-90"
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/images/placeholders/watch-placeholder.svg"
              width={800}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
