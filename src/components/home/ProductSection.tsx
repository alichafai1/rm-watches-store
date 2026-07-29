import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils/format-price";
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
              <article
                className="group rounded-2xl border border-neutral-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[var(--shadow-md)]"
                key={product.id}
              >
                <Link className="grid gap-4" href={`/products/${product.slug}`}>
                  {product.images[0] ? (
                    <Image
                      alt={product.images[0].alt}
                      className="aspect-square w-full rounded-xl object-cover"
                      height={product.images[0].height}
                      src={product.images[0].url}
                      width={product.images[0].width}
                    />
                  ) : null}
                  <div className="grid gap-2 px-1 pb-1">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9f7d3f]">
                      {product.movement}
                    </p>
                    <h3 className="text-base font-semibold tracking-tight text-neutral-950">
                      {product.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </ResponsiveGrid>
        </div>
      </Container>
    </Section>
  );
}
