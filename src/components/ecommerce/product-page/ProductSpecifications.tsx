import type { ProductSpecification } from "@/types/product";

type ProductSpecificationsProps = {
  items: ProductSpecification[];
};

export function ProductSpecifications({ items }: ProductSpecificationsProps) {
  const rows = items.filter((item) => item.label.trim() || item.value.trim());

  if (rows.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="product-specifications-heading">
      <h2
        className="text-xl font-semibold tracking-tight text-neutral-950"
        id="product-specifications-heading"
      >
        Specifications
      </h2>
      <dl className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
        {rows.map((row, index) => (
          <div
            className={
              index % 2 === 0
                ? "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm last:border-b-0"
                : "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3 border-b border-neutral-200 bg-white px-4 py-2.5 text-sm last:border-b-0"
            }
            key={`${row.label}-${index}`}
          >
            <dt className="font-medium text-neutral-600">{row.label}</dt>
            <dd className="text-neutral-950">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
