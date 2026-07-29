import Link from "next/link";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Container } from "@/components/ui/Container";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/types/product";

type ProductSectionProps = {
  description: string;
  eyebrow?: string;
  products: Product[];
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
};

export function ProductSection({
  description,
  eyebrow,
  products,
  title,
  viewAllHref,
  viewAllLabel,
}: ProductSectionProps) {
  const headingId = `${title.toLowerCase().replaceAll(" ", "-")}-heading`;

  return (
    <Section ariaLabelledBy={headingId} className="bg-white" spacing="lg">
      <Container>
        <div className="grid gap-8">
          <HomeSectionHeader
            align="center"
            description={description}
            eyebrow={eyebrow}
            headingId={headingId}
            linkHref={viewAllHref}
            linkLabel={viewAllLabel}
            title={title}
          />

          <ResponsiveGrid columns="product">
            {products.map((product) => (
              <ProductCard
                headingLevel="h3"
                key={product.id}
                product={product}
              />
            ))}
          </ResponsiveGrid>
        </div>
      </Container>
    </Section>
  );
}
