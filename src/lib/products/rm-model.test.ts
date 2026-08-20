import { describe, expect, it } from "vitest";
import { getProductRmModelRef, parseRmModelRef } from "@/lib/products/rm-model";
import type { Product } from "@/types/product";

describe("parseRmModelRef", () => {
  it("normalizes equivalent RM 35-02 spellings", () => {
    for (const value of ["RM35-02", "RM 35-02", "RM 035-02", "rm 35 - 02"]) {
      expect(parseRmModelRef(value)).toEqual({ exact: "35-02", family: "35" });
    }
  });

  it("treats RM 035 as the 35 family without a variant", () => {
    expect(parseRmModelRef("RM 035")).toEqual({ exact: "35", family: "35" });
  });

  it("normalizes RM 67-02 spellings", () => {
    expect(parseRmModelRef("RM67-02")).toEqual({ exact: "67-02", family: "67" });
    expect(parseRmModelRef("RM 67-02")).toEqual({ exact: "67-02", family: "67" });
  });

  it("keeps RM 11-04 and RM 11-02 in the same family", () => {
    expect(parseRmModelRef("RM 11-04")).toEqual({ exact: "11-04", family: "11" });
    expect(parseRmModelRef("RM 11-02")).toEqual({ exact: "11-02", family: "11" });
  });

  it("does not treat RM 007 as the same exact model as RM 07-01", () => {
    expect(parseRmModelRef("RM 007")).toEqual({ exact: "7", family: "7" });
    expect(parseRmModelRef("RM 07-01")).toEqual({ exact: "7-01", family: "7" });
  });
});

describe("getProductRmModelRef", () => {
  const base = {
    collection: { id: "20", name: "RM 035", slug: "rm-035" },
    specifications: [] as Product["specifications"],
  };

  it("prefers the Model spec over the collection name", () => {
    expect(
      getProductRmModelRef({
        ...base,
        title: "Richard Mille replica watch",
        specifications: [{ label: "Model", value: "RM 35-02" }],
      }),
    ).toEqual({ exact: "35-02", family: "35" });
  });

  it("uses Range when Model is empty", () => {
    expect(
      getProductRmModelRef({
        ...base,
        title: "Richard Mille replica watch",
        specifications: [{ label: "Range", value: "RM 27-05" }],
      }),
    ).toEqual({ exact: "27-05", family: "27" });
  });

  it("falls back to the title when specs are missing", () => {
    expect(
      getProductRmModelRef({
        ...base,
        title: "Richard Mille RM 27-05 Rafael Nadal Replica with 38g Case",
        specifications: [],
      }),
    ).toEqual({ exact: "27-05", family: "27" });
  });
});
