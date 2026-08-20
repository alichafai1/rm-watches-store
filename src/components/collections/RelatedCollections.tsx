import { CollectionCard } from "@/components/ecommerce/CollectionCard";
import type { RelatedCollectionItem } from "@/lib/collections/related-collections";

type RelatedCollectionsProps = {
  items: RelatedCollectionItem[];
};

export function RelatedCollections({ items }: RelatedCollectionsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-collections-heading"
      className="border-t border-neutral-200 pt-10"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Continue browsing
        </p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950"
          id="related-collections-heading"
        >
          Related Collections
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <CollectionCard
            basePath={item.basePath}
            collection={item.collection}
            headingLevel="h3"
            key={`${item.basePath}/${item.collection.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
