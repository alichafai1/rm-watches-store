import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article } from "@/types/article";

type GuideCardProps = {
  guide: Article;
};

export function GuideCard({ guide }: GuideCardProps) {
  return <ArticleCard article={guide} hrefBase="/guides" />;
}
