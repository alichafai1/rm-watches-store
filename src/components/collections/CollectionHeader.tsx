import { getCollectionTagline } from "@/constants/collection-taglines";
import type { Collection } from "@/types/collection";

type CollectionHeaderProps = {
  collection: Collection;
  productCount: number;
};

export function CollectionHeader({
  collection,
  productCount,
}: CollectionHeaderProps) {
  return (
    <div className="border-b border-neutral-200 pb-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Curated selection
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {collection.name}
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {getCollectionTagline(collection.name)}
        </p>
        <p className="mt-3 text-sm font-medium text-neutral-950">
          {productCount} products
        </p>
      </div>
    </div>
  );
}
