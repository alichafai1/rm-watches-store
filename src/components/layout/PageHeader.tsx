import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Typography } from "@/components/ui/Typography";
import type { BreadcrumbItem } from "@/types/seo";

type PageHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  description?: string;
  title: string;
};

export function PageHeader({
  breadcrumbs = [],
  description,
  title,
}: PageHeaderProps) {
  return (
    <header className="grid gap-4">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid gap-3">
        <Typography as="h1" variant="h1">
          {title}
        </Typography>
        {description ? (
          <Typography className="max-w-2xl" muted variant="body">
            {description}
          </Typography>
        ) : null}
      </div>
    </header>
  );
}
