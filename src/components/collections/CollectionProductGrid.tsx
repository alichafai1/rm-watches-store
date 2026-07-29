import { ProductCard } from "@/components/ecommerce/ProductCard";
import type { Product } from "@/types/product";

type CollectionProductGridProps = {
  products: Product[];
};

const paginationItems = ["Previous", "1", "2", "3", "Next"];

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            headingLevel="h3"
            key={product.id}
            product={product}
            showAction
          />
        ))}
      </div>

      <nav aria-label="Collection pagination" className="flex justify-center">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {paginationItems.map((item) => {
            const isCurrent = item === "1";

            return (
              <li key={item}>
                <button
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-950 bg-neutral-950 px-3 text-sm font-medium text-white"
                      : "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-950"
                  }
                  disabled
                  type="button"
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
