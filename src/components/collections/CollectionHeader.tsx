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
    <div className="flex flex-col gap-5 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Curated selection
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {collection.name}
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {collection.description}
        </p>
        <p className="mt-3 text-sm font-medium text-neutral-950">
          {productCount} products
        </p>
      </div>
      <div className="grid gap-2 sm:min-w-56">
        <label
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
          htmlFor="collection-sort"
        >
          Sort by
        </label>
        <select
          className="min-h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-600"
          defaultValue="featured"
          disabled
          id="collection-sort"
        >
          <option value="featured">Featured placeholder</option>
          <option value="newest">Newest placeholder</option>
          <option value="price-low">Price low to high</option>
        </select>
      </div>
    </div>
  );
}
