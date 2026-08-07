import Image from "next/image";
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
        Desktop-only preload: the art is `hidden` below md, and Next `priority`
        would still preload it on mobile — competing with the text LCP.
      */}
      <link
        rel="preload"
        as="image"
        href={HERO_IMAGE_SRC}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      {/* Desktop/tablet: full hero image. Phone: solid black (left side of the art). */}
      <Image
        alt="Richard MIlle Replica Watches Super Clone watches "
        className="hidden object-cover object-center md:block"
        fill
        sizes="100vw"
        src={HERO_IMAGE_SRC}
        unoptimized
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
                <span className="block">Replica Watches</span>
                <span className="block">Made for Every Moment</span>
              </Typography>
              <Typography className="max-w-lg text-neutral-300" variant="body">
                Premium replica watches, handcrafted detail.
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
