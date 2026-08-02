import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { sanitizeArticleHtml } from "@/lib/utils/article-html";
import type { Article } from "@/types/article";

type ArticleDetailProps = {
  article: Article;
};

function formatDate(value?: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const isGuide = article.type === "guide";
  const base = isGuide ? "/guides" : "/blog";
  const label = isGuide ? "Guides" : "Blog";
  const published = formatDate(article.publishedAt);
  const updated =
    article.updatedAt && article.updatedAt !== article.publishedAt
      ? formatDate(article.updatedAt)
      : null;

  return (
    <Section ariaLabelledBy="article-title" spacing="lg">
      <Container size="md">
        <article>
          <Breadcrumbs
            items={[
              { label, href: base },
              { label: article.title, href: `${base}/${article.slug}` },
            ]}
          />
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9f7d3f]">
              {isGuide ? "Watch guide" : "Watch article"}
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl"
              id="article-title"
            >
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
              {article.excerpt}
            </p>
            {published ? (
              <p className="mt-4 text-sm text-neutral-500">
                Published {published}
                {updated ? ` · Updated ${updated}` : ""}
              </p>
            ) : null}
          </header>

          {article.image ? (
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                alt={article.image.alt}
                className="aspect-[16/9] w-full object-cover"
                height={article.image.height}
                priority
                src={article.image.url}
                width={article.image.width}
              />
            </div>
          ) : null}

          <div
            className="article-content mx-auto mt-10 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleHtml(article.content),
            }}
          />

          <footer className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-3 border-t border-neutral-200 pt-6 text-sm">
            <Link
              className="font-semibold text-neutral-950 underline-offset-4 hover:underline"
              href={base}
            >
              View all {label.toLowerCase()}
            </Link>
            <span aria-hidden="true" className="text-neutral-300">
              ·
            </span>
            <Link
              className="font-semibold text-neutral-950 underline-offset-4 hover:underline"
              href="/shop"
            >
              Explore watches
            </Link>
          </footer>
        </article>
      </Container>
    </Section>
  );
}
