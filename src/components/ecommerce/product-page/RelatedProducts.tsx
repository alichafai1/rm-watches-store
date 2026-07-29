import { ProductCard } from "@/components/ecommerce/ProductCard";
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
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard headingLevel="h3" key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
