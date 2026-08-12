import Link from "next/link";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteAuthor } from "@/constants/author";
import { isSupabasePublicStorageUrl } from "@/lib/images/supabase-transform";
import {
  sanitizeArticleHtml,
  sanitizeArticleInlineHtml,
  sanitizeArticleRichBlockHtml,
} from "@/lib/utils/article-html";
import type { Article, ArticleContentBlock } from "@/types/article";

type ArticleDetailProps = {
  article: Article;
  relatedArticles?: Article[];
};

function formatDate(value?: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}

function isSafeImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ArticleBodyImage({
  block,
}: {
  block: Extract<ArticleContentBlock, { type: "image" }>;
}) {
  if (
    !isSafeImageUrl(block.url) ||
    block.width <= 0 ||
    block.height <= 0
  ) {
    return null;
  }

  const imageClassName =
    "mx-auto h-auto max-h-[760px] w-auto max-w-full object-contain";
  return (
    <figure className="my-8">
      {isSupabasePublicStorageUrl(block.url) ||
      (block.url.startsWith("/") && !block.url.startsWith("//")) ? (
        <StorefrontImage
          alt={block.alt}
          className={imageClassName}
          height={block.height}
          loading="lazy"
          preset="editorial"
          sizes="(max-width: 768px) 100vw, 768px"
          src={block.url}
          width={block.width}
        />
      ) : (
        // Arbitrary CMS hosts cannot safely pass through the configured optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={block.alt}
          className={imageClassName}
          height={block.height}
          loading="lazy"
          src={block.url}
          width={block.width}
        />
      )}
      {block.caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ArticleBlocks({ blocks }: { blocks: ArticleContentBlock[] }) {
  return blocks.map((block) => {
    switch (block.type) {
      case "heading":
        return block.level === 2 ? (
          <h2 key={block.id}>{block.text}</h2>
        ) : (
          <h3 key={block.id}>{block.text}</h3>
        );
      case "paragraph":
        return (
          <div
            className="article-rich-block"
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleRichBlockHtml(block.html),
            }}
            key={block.id}
          />
        );
      case "list": {
        const List = block.style === "ordered" ? "ol" : "ul";
        return (
          <List key={block.id}>
            {block.items.map((item, index) => (
              <li
                dangerouslySetInnerHTML={{
                  __html: sanitizeArticleInlineHtml(item),
                }}
                key={`${block.id}-${index}`}
              />
            ))}
          </List>
        );
      }
      case "quote":
        return (
          <blockquote
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleInlineHtml(block.html),
            }}
            key={block.id}
          />
        );
      case "image":
        return <ArticleBodyImage block={block} key={block.id} />;
    }
  });
}

export function ArticleDetail({
  article,
  relatedArticles = [],
}: ArticleDetailProps) {
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
              { label: "Home", href: "/" },
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
            {!isGuide ? (
              <p className="mt-4 text-sm text-neutral-500">
                By{" "}
                <Link
                  className="font-medium text-neutral-800 underline-offset-4 hover:text-neutral-950 hover:underline"
                  href={siteAuthor.path}
                >
                  {siteAuthor.name}
                </Link>
              </p>
            ) : null}
            {published ? (
              <p className={`text-sm text-neutral-500 ${isGuide ? "mt-4" : "mt-2"}`}>
                Published{" "}
                <time dateTime={article.publishedAt}>{published}</time>
                {updated && article.updatedAt ? (
                  <>
                    {" · Updated "}
                    <time dateTime={article.updatedAt}>{updated}</time>
                  </>
                ) : null}
              </p>
            ) : null}
          </header>

          {article.image ? (
            <div className="mx-auto mt-10 flex max-w-4xl justify-center">
              <StorefrontImage
                alt={article.image.alt}
                className="h-auto max-h-[760px] w-auto max-w-full object-contain"
                height={article.image.height}
                preset="editorial"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                src={article.image.url}
                width={article.image.width}
              />
            </div>
          ) : null}

          {article.contentBlocks ? (
            <div className="article-content mx-auto mt-10 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">
              <ArticleBlocks blocks={article.contentBlocks} />
            </div>
          ) : (
            <div
              className="article-content mx-auto mt-10 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg"
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(article.content),
              }}
            />
          )}

          <footer className="mx-auto mt-12 max-w-3xl border-t border-neutral-200 pt-6 text-sm">
            {relatedArticles.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-neutral-950">
                  Related reading
                </h2>
                <ul className="mt-3 grid gap-2">
                  {relatedArticles.map((related) => (
                    <li key={related.id}>
                      <Link
                        className="text-neutral-700 underline-offset-4 hover:text-neutral-950 hover:underline"
                        href={`/${related.type === "guide" ? "guides" : "blog"}/${related.slug}`}
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
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
            </div>
          </footer>
        </article>
      </Container>
    </Section>
  );
}
