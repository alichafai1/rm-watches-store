import Link from "next/link";
import { ArticleCardBase } from "@/components/blog/ArticleCardBase";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import type { Article } from "@/types/article";

type ArticleCardProps = {
  article: Article;
  headingLevel?: "h2" | "h3";
  hrefBase: "/blog" | "/guides";
};

export function ArticleCard({
  article,
  headingLevel = "h2",
  hrefBase,
}: ArticleCardProps) {
  const Heading = headingLevel;

  return (
    <ArticleCardBase className="h-full content-start gap-3">
      {article.image ? (
        <StorefrontImage
          alt={article.image.alt}
          className="aspect-[4/3] w-full rounded-md object-cover"
          height={article.image.height}
          preset="articleCard"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={article.image.url}
          width={article.image.width}
        />
      ) : null}
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        {article.type === "guide" ? "Guide" : "Blog"}
      </p>
      <Heading className="text-base font-semibold leading-snug tracking-tight">
        <Link
          className="transition-colors hover:text-neutral-600"
          href={`${hrefBase}/${article.slug}`}
        >
          {article.title}
        </Link>
      </Heading>
      <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
        {article.excerpt}
      </p>
    </ArticleCardBase>
  );
}
