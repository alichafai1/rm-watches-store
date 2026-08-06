import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import type { Product } from "@/types/product";

type CollectionProductGridProps = {
  products: Product[];
};

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
  return (
    <ResponsiveGrid columns="product">
      {products.map((product) => (
        <ProductCard
          headingLevel="h3"
          key={product.id}
          product={product}
          showAction
        />
      ))}
    </ResponsiveGrid>
  );
}
