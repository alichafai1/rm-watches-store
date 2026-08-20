import { describe, expect, it } from "vitest";
import { selectRelatedProducts } from "@/lib/products/related-products";
import type { RelatedProductSource } from "@/lib/products/related-products";

function product(
  id: string,
  title: string,
  collectionId: string,
  collectionName: string,
  spec?: { label: string; value: string },
): RelatedProductSource {
  return {
    id,
    title,
    collectionId,
    collection: { id: collectionId, name: collectionName, slug: collectionId },
    specifications: spec ? [spec] : [],
  };
}

describe("selectRelatedProducts", () => {
  it("ranks the same exact model ahead of other family members", () => {
    const current = product("a", "RM 35-02 black", "20", "RM 035", {
      label: "Range",
      value: "RM 35-02",
    });
    const catalog = [
      current,
      product("b", "RM 35-01 carbon", "20", "RM 035", {
        label: "Range",
        value: "RM 35-01",
      }),
      product("c", "RM 35-02 red", "20", "RM 035", {
        label: "Range",
        value: "RM 35-02",
      }),
      product("d", "RM 35-03 blue", "20", "RM 035", {
        label: "Range",
        value: "RM 35-03",
      }),
    ];

    expect(selectRelatedProducts(current, catalog, 4).map((item) => item.id)).toEqual([
      "c",
      "b",
      "d",
    ]);
  });

  it("does not pad a single RM 11-04 with unrelated newest products", () => {
    const current = product("1104", "Richard Mille RM 11-04 Super Clone", "13", "RM 11-04", {
      label: "Range",
      value: "RM 11-04",
    });
    const catalog = [
      product("5703", "RM 57-03 Dragon", "na-8", "RM 57-03", {
        label: "Range",
        value: "RM 57-03",
      }),
      product("5102", "RM 51-02 Diamond", "na-6", "RM 51-02", {
        label: "Range",
        value: "RM 51-02",
      }),
      product("5101", "RM 51-01 Tiger", "na-5", "RM 51-01", {
        label: "Range",
        value: "RM 51-01",
      }),
      product("2601", "RM 26-01 Panda", "na-4", "RM 26-01", {
        label: "Range",
        value: "RM 26-01",
      }),
      current,
      product("1102", "Replica Richard Mille RM 11-02", "14", "RM 11-02", {
        label: "Model",
        value: "RM 11-02",
      }),
    ];

    expect(selectRelatedProducts(current, catalog, 4).map((item) => item.id)).toEqual([
      "1102",
    ]);
  });

  it("excludes the current product", () => {
    const current = product("a", "RM 67-02 red", "8", "RM 67", {
      label: "Range",
      value: "RM 67-02",
    });
    const catalog = [
      current,
      product("b", "RM 67-02 black", "8", "RM 67", {
        label: "Range",
        value: "RM67-02",
      }),
    ];

    expect(selectRelatedProducts(current, catalog, 4).map((item) => item.id)).toEqual([
      "b",
    ]);
  });

  it("returns fewer than four products when no genuine matches remain", () => {
    const current = product("a", "RM 57-03 Dragon", "na-8", "RM 57-03", {
      label: "Range",
      value: "RM 57-03",
    });
    const catalog = [
      current,
      product("b", "RM 26-01 Panda", "na-4", "RM 26-01", {
        label: "Range",
        value: "RM 26-01",
      }),
    ];

    expect(selectRelatedProducts(current, catalog, 4)).toEqual([]);
  });
});
