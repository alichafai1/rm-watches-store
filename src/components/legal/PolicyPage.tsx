import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { BreadcrumbItem } from "@/types/seo";

type PolicyPageProps = {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
};

/** Blank legal page shell. Content is added once each policy is ready. */
export function PolicyPage({ breadcrumbs = [], title }: PolicyPageProps) {
  return (
    <Container>
      <Section>
        <div className="grid gap-8">
          <PageHeader breadcrumbs={breadcrumbs} title={title} />
          <div className="min-h-40" />
        </div>
      </Section>
    </Container>
  );
}
