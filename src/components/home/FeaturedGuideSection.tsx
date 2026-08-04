import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";
import type { Article } from "@/types/article";

type FeaturedGuideSectionProps = {
  guide: Article;
};

export function FeaturedGuideSection({ guide }: FeaturedGuideSectionProps) {
  const image = guide.image;

  return (
    <Section ariaLabelledBy="featured-guide-heading">
      <Container>
        <article className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[var(--shadow-sm)] lg:grid-cols-2">
          <div className="bg-neutral-50 p-4">
            {image ? (
              <Image
                alt={image.alt}
                className="aspect-square w-full rounded-lg object-cover"
                height={image.height}
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={image.url}
                width={image.width}
              />
            ) : null}
          </div>
          <div className="grid content-center gap-5 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Featured Watch Guide
            </p>
            <div className="grid gap-3">
              <Typography as="h2" id="featured-guide-heading" variant="h2">
                {guide.title}
              </Typography>
              <Typography muted variant="body">
                {guide.excerpt}
              </Typography>
            </div>
            <LinkButton className="w-fit" href={`/guides/${guide.slug}`}>
              Read the Guide
            </LinkButton>
          </div>
        </article>
      </Container>
    </Section>
  );
}
