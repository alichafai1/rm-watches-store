import { describe, expect, it } from "vitest";
import { getRelatedCollections } from "@/lib/collections/related-collections";

function relatedPaths(kind: "collection" | "new-arrival", slug: string) {
  return getRelatedCollections(kind, slug).map(
    (item) => `${item.basePath}/${item.collection.slug}`,
  );
}

describe("getRelatedCollections", () => {
  it("maps same-family collection pages without self-links or filler", () => {
    const expected: Array<
      ["collection" | "new-arrival", string, string[]]
    > = [
      ["collection", "rm-11-04", ["/collections/rm-11-02"]],
      ["collection", "rm-11-02", ["/collections/rm-11-04"]],
      ["collection", "rm-52-01", ["/collections/rm-52-06"]],
      ["collection", "rm-52-06", ["/collections/rm-52-01"]],
      ["collection", "rm-56-01", ["/collections/rm-56-02"]],
      ["collection", "rm-56-02", ["/collections/rm-56-01"]],
      [
        "collection",
        "rm-027",
        [
          "/new-arrival-collections/rm-27-02",
          "/new-arrival-collections/rm-27-04",
        ],
      ],
      [
        "new-arrival",
        "rm-27-02",
        ["/collections/rm-027", "/new-arrival-collections/rm-27-04"],
      ],
      [
        "new-arrival",
        "rm-27-04",
        ["/collections/rm-027", "/new-arrival-collections/rm-27-02"],
      ],
      [
        "new-arrival",
        "rm-07-01",
        [
          "/new-arrival-collections/rm-07-02",
          "/new-arrival-collections/rm-07-03",
        ],
      ],
      [
        "new-arrival",
        "rm-07-02",
        [
          "/new-arrival-collections/rm-07-01",
          "/new-arrival-collections/rm-07-03",
        ],
      ],
      [
        "new-arrival",
        "rm-07-03",
        [
          "/new-arrival-collections/rm-07-01",
          "/new-arrival-collections/rm-07-02",
        ],
      ],
      ["new-arrival", "rm-50-02", ["/new-arrival-collections/rm-50-03"]],
      ["new-arrival", "rm-50-03", ["/new-arrival-collections/rm-50-02"]],
      ["new-arrival", "rm-51-01", ["/new-arrival-collections/rm-51-02"]],
      ["new-arrival", "rm-51-02", ["/new-arrival-collections/rm-51-01"]],
      ["new-arrival", "rm-57-01", ["/new-arrival-collections/rm-57-03"]],
      ["new-arrival", "rm-57-03", ["/new-arrival-collections/rm-57-01"]],
      ["collection", "rm-026", ["/new-arrival-collections/rm-26-01"]],
      ["new-arrival", "rm-26-01", ["/collections/rm-026"]],
      ["collection", "rm-030", ["/new-arrival-collections/rm-30-01"]],
      ["new-arrival", "rm-30-01", ["/collections/rm-030"]],
    ];

    for (const [kind, slug, paths] of expected) {
      expect(relatedPaths(kind, slug)).toEqual(paths);
      expect(paths).not.toContain(
        `${kind === "collection" ? "/collections" : "/new-arrival-collections"}/${slug}`,
      );
      expect(paths.length).toBeGreaterThan(0);
      expect(paths.length).toBeLessThanOrEqual(4);
    }
  });

  it("does not mix RM 007 with the RM 07-01 family", () => {
    expect(getRelatedCollections("collection", "rm-007")).toEqual([]);
    expect(
      relatedPaths("new-arrival", "rm-07-01").some((path) =>
        path.endsWith("/rm-007"),
      ),
    ).toBe(false);
  });

  it("returns nothing when no sibling collection exists", () => {
    expect(getRelatedCollections("collection", "rm-035")).toEqual([]);
    expect(getRelatedCollections("collection", "rm-67")).toEqual([]);
  });
});
