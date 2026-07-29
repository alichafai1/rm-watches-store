import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { BreadcrumbItem } from "@/types/seo";

type PlaceholderPageProps = {
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  breadcrumbs = [],
  children,
}: PlaceholderPageProps) {
  return (
    <Container>
      <Section>
        <div className="grid gap-8">
          <PageHeader
            breadcrumbs={breadcrumbs}
            description={description}
            title={title}
          />
          {children ? <div>{children}</div> : null}
        </div>
      </Section>
    </Container>
  );
}
