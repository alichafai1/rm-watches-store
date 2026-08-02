import Image from "next/image";
import Link from "next/link";
import { ArticleCardBase } from "@/components/blog/ArticleCardBase";
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
    <ArticleCardBase>
      {article.image ? (
        <Image
          alt={article.image.alt}
          className="aspect-[4/3] w-full rounded-md object-cover"
          height={article.image.height}
          src={article.image.url}
          width={article.image.width}
        />
      ) : null}
      <p className="text-xs uppercase tracking-wide text-neutral-600">
        {article.type === "guide" ? "Guide" : "Blog"}
      </p>
      <Heading className="text-base font-semibold">
        <Link href={`${hrefBase}/${article.slug}`}>{article.title}</Link>
      </Heading>
      <p className="text-sm text-neutral-700">{article.excerpt}</p>
    </ArticleCardBase>
  );
}
