import { getCollectionBySlug } from "@/lib/data/collections";
import { getNewArrivalCollectionBySlug } from "@/lib/data/new-arrival-collections";
import type { Collection } from "@/types/collection";

export type CollectionKind = "collection" | "new-arrival";

export type RelatedCollectionItem = {
  collection: Collection;
  basePath: "/collections" | "/new-arrival-collections";
};

type RelatedTarget = {
  kind: CollectionKind;
  slug: string;
};

const MAX_RELATED_COLLECTIONS = 4;

function collectionKey(kind: CollectionKind, slug: string) {
  return `${kind}:${slug}`;
}

function sameKindFamily(kind: CollectionKind, slugs: string[]) {
  const map: Record<string, RelatedTarget[]> = {};
  for (const slug of slugs) {
    map[collectionKey(kind, slug)] = slugs
      .filter((relatedSlug) => relatedSlug !== slug)
      .map((relatedSlug) => ({ kind, slug: relatedSlug }));
  }
  return map;
}

function mixedFamily(members: RelatedTarget[]) {
  const map: Record<string, RelatedTarget[]> = {};
  for (const member of members) {
    map[collectionKey(member.kind, member.slug)] = members.filter(
      (related) =>
        related.kind !== member.kind || related.slug !== member.slug,
    );
  }
  return map;
}

/**
 * Explicit same-family relationships only. Missing or unpublished routes are
 * skipped at lookup time so this never invents collection URLs.
 */
export const relatedCollectionMap: Record<string, RelatedTarget[]> = {
  ...sameKindFamily("collection", ["rm-11-04", "rm-11-02"]),
  ...sameKindFamily("collection", ["rm-52-01", "rm-52-06"]),
  ...sameKindFamily("collection", ["rm-56-01", "rm-56-02"]),
  ...sameKindFamily("new-arrival", ["rm-50-02", "rm-50-03"]),
  ...sameKindFamily("new-arrival", ["rm-51-01", "rm-51-02"]),
  ...sameKindFamily("new-arrival", ["rm-57-01", "rm-57-03"]),
  ...sameKindFamily("new-arrival", ["rm-07-01", "rm-07-02", "rm-07-03"]),
  ...mixedFamily([
    { kind: "collection", slug: "rm-027" },
    { kind: "new-arrival", slug: "rm-27-02" },
    { kind: "new-arrival", slug: "rm-27-04" },
  ]),
  ...mixedFamily([
    { kind: "collection", slug: "rm-026" },
    { kind: "new-arrival", slug: "rm-26-01" },
  ]),
  ...mixedFamily([
    { kind: "collection", slug: "rm-030" },
    { kind: "new-arrival", slug: "rm-30-01" },
  ]),
};

function resolveRelatedTarget(target: RelatedTarget): RelatedCollectionItem | null {
  if (target.kind === "collection") {
    const collection = getCollectionBySlug(target.slug);
    return collection
      ? { collection, basePath: "/collections" }
      : null;
  }

  const collection = getNewArrivalCollectionBySlug(target.slug);
  return collection
    ? { collection, basePath: "/new-arrival-collections" }
    : null;
}

export function getRelatedCollections(
  kind: CollectionKind,
  slug: string,
): RelatedCollectionItem[] {
  const targets = relatedCollectionMap[collectionKey(kind, slug)] ?? [];
  const items: RelatedCollectionItem[] = [];

  for (const target of targets) {
    if (target.kind === kind && target.slug === slug) continue;
    const resolved = resolveRelatedTarget(target);
    if (!resolved) continue;
    if (
      items.some(
        (item) =>
          item.basePath === resolved.basePath &&
          item.collection.slug === resolved.collection.slug,
      )
    ) {
      continue;
    }
    items.push(resolved);
    if (items.length >= MAX_RELATED_COLLECTIONS) break;
  }

  return items;
}
