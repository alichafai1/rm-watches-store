import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { BreadcrumbItem } from "@/types/seo";

type PolicyPageProps = {
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  title: string;
};

/** Legal policy page shell. Pass content as children when ready. */
export function PolicyPage({
  breadcrumbs = [],
  children,
  title,
}: PolicyPageProps) {
  return (
    <Container>
      <Section>
        <div className="grid gap-8">
          <PageHeader breadcrumbs={breadcrumbs} title={title} />
          {children ? (
            <div className="article-content max-w-3xl text-base leading-7 text-neutral-700">
              {children}
            </div>
          ) : (
            <div className="min-h-40" />
          )}
        </div>
      </Section>
    </Container>
  );
}
