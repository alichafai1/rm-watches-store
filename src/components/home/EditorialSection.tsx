import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import type { Article } from "@/types/article";

type EditorialSectionProps = {
  articles: Article[];
  guide?: Article;
};

export function EditorialSection({ articles, guide }: EditorialSectionProps) {
  return (
    <Section ariaLabelledBy="editorial-heading" className="bg-white" spacing="lg">
      <Container>
        <div className="grid gap-8">
          <HomeSectionHeader
            align="center"
            description="Expert guidance and practical articles to help you choose, understand, and care for your watch."
            eyebrow="Guides and articles"
            headingId="editorial-heading"
            title="Learn Before You Choose"
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {guide ? (
              <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                {guide.image ? (
                  <Image
                    alt={guide.image.alt}
                    className="h-auto max-h-[460px] w-full bg-white object-contain"
                    height={guide.image.height}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    src={guide.image.url}
                    width={guide.image.width}
                  />
                ) : null}
                <div className="grid gap-4 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9f7d3f]">
                    Watch Guides
                  </p>
                  <div className="grid gap-3">
                    <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                      {guide.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-6 text-neutral-600">
                      {guide.excerpt}
                    </p>
                  </div>
                  <LinkButton
                    className="home-cta-accent w-fit"
                    href={`/guides/${guide.slug}`}
                  >
                    Read the Guide
                  </LinkButton>
                </div>
              </article>
            ) : null}

            <div className="grid gap-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9f7d3f]">
                    Latest Blog Posts
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    Latest Watch Articles
                  </h3>
                </div>
                <LinkButton href="/blog" variant="text">
                  View all
                </LinkButton>
              </div>

              {articles.map((article) => (
                <Link
                  className="group grid grid-cols-[96px_1fr] gap-4 rounded-2xl border border-neutral-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[var(--shadow-sm)] sm:grid-cols-[128px_1fr]"
                  href={`/blog/${article.slug}`}
                  key={article.id}
                >
                  {article.image ? (
                    <Image
                      alt={article.image.alt}
                      className="aspect-square w-full rounded-xl bg-white object-contain"
                      height={article.image.height}
                      sizes="(max-width: 640px) 96px, 128px"
                      src={article.image.url}
                      width={article.image.width}
                    />
                  ) : null}
                  <div className="grid content-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9f7d3f]">
                      Blog
                    </p>
                    <h3 className="text-base font-semibold tracking-tight text-neutral-950">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
