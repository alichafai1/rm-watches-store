import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import type { Product } from "@/types/product";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-products-heading" className="border-t border-neutral-200 pt-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Continue browsing
        </p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950"
          id="related-products-heading"
        >
          Related Products
        </h2>
      </div>
      <ResponsiveGrid className="mt-8" columns="product">
        {products.map((product) => (
          <ProductCard headingLevel="h3" key={product.id} product={product} />
        ))}
      </ResponsiveGrid>
    </section>
  );
}
