"use client";

import { useMemo, useState } from "react";
import { Field, inputClassName } from "@/components/admin/Field";

export type AdminCollectionOption = {
  id: string;
  name: string;
  slug: string;
  group: "Featured" | "New Arrival";
};

type CollectionSelectProps = {
  collections: AdminCollectionOption[];
  initialId?: string;
};

export function CollectionSelect({
  collections,
  initialId = "",
}: CollectionSelectProps) {
  const [selectedId, setSelectedId] = useState(initialId);

  const selected = useMemo(
    () => collections.find((collection) => collection.id === selectedId),
    [collections, selectedId],
  );

  const featured = collections.filter(
    (collection) => collection.group === "Featured",
  );
  const newArrivals = collections.filter(
    (collection) => collection.group === "New Arrival",
  );

  return (
    <div className="grid gap-3">
      <input name="collection_id" type="hidden" value={selected?.id ?? ""} />
      <input
        name="collection_name"
        type="hidden"
        value={selected?.name ?? ""}
      />
      <input
        name="collection_slug"
        type="hidden"
        value={selected?.slug ?? ""}
      />

      <Field label="Choose collection">
        <select
          className={inputClassName}
          onChange={(event) => setSelectedId(event.target.value)}
          required
          value={selectedId}
        >
          <option value="">Select a collection…</option>
          {featured.length > 0 ? (
            <optgroup label="Featured collections">
              {featured.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </optgroup>
          ) : null}
          {newArrivals.length > 0 ? (
            <optgroup label="New arrival collections">
              {newArrivals.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </Field>

      {selected ? (
        <p className="text-sm text-neutral-600">
          Selected: <span className="font-medium text-neutral-950">{selected.name}</span>
          {" · "}
          <span className="text-neutral-500">{selected.slug}</span>
        </p>
      ) : null}
    </div>
  );
}
