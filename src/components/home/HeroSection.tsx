import { StorefrontImage } from "@/components/media/StorefrontImage";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

const HERO_IMAGE_SRC =
  "https://jolmyqqzsqvyapoixnqh.supabase.co/storage/v1/object/public/website-media/Richard%20Mille%20Replica.webp";

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden bg-black text-white" spacing="sm">
      {/*
        Supabase transform (bypass Vercel `/_next/image`). Hidden below md;
        avoid `priority` so mobile text LCP is not competing with a hero fetch.
      */}
      <StorefrontImage
        alt="Richard MIlle Replica Watches Super Clone watches "
        className="hidden object-cover object-center md:block"
        fill
        preset="hero"
        sizes="100vw"
        src={HERO_IMAGE_SRC}
      />
      <Container>
        <div className="relative grid min-h-[520px] items-center py-8">
          <div className="relative z-10 grid max-w-lg gap-6">
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6bd7f]">
                Modern watch store
              </p>
              <Typography
                as="h1"
                className="max-w-lg text-white"
                variant="display"
              >
                Richard Mille Replica Watches & Super Clone RM Models
              </Typography>
              <Typography className="max-w-lg text-neutral-300" variant="body">
                Explore replica Richard Mille watches across popular RM collections, with detailed images, clear specifications, pricing, and new arrivals.
              </Typography>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton
                className="home-cta-accent"
                href="/shop"
                size="lg"
              >
                Shop Watches
              </LinkButton>
              <LinkButton
                className="home-cta-outline-dark"
                href="/collections"
                size="lg"
                variant="outline"
              >
                Explore Collections
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
