import { ArticleCard } from "@/components/blog/ArticleCard";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";
import type { Article } from "@/types/article";

type LatestArticlesSectionProps = {
  articles: Article[];
};

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
  return (
    <Section ariaLabelledBy="latest-articles-heading">
      <Container>
        <div className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-2">
              <Typography as="h2" id="latest-articles-heading" variant="h2">
                Latest Watch Articles
              </Typography>
              <Typography className="max-w-2xl" muted variant="small">
                Read short editorial placeholders that will later support
                product education and internal linking.
              </Typography>
            </div>
            <LinkButton href="/blog" variant="text">
              View all articles
            </LinkButton>
          </div>

          <ResponsiveGrid columns="three">
            {articles.map((article) => (
              <ArticleCard
                article={article}
                headingLevel="h3"
                hrefBase="/blog"
                key={article.id}
              />
            ))}
          </ResponsiveGrid>
        </div>
      </Container>
    </Section>
  );
}
