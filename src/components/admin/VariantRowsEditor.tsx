"use client";

import { useState } from "react";
import { Field, inputClassName } from "@/components/admin/Field";
import type { ProductVariant } from "@/types/product";

export const DEFAULT_VERSION_NAMES = [
  "AAAAA Clone",
  "1:1 Clone",
  "Top 1:1 Clone",
] as const;

type VariantRowsEditorProps = {
  name?: string;
  initialVariants?: ProductVariant[];
  fallbackPrice?: number;
};

function createDefaultVariants(price = 0): ProductVariant[] {
  return DEFAULT_VERSION_NAMES.map((name) => ({
    name,
    price,
    description: "",
  }));
}

function createEmptyVariant(price = 0): ProductVariant {
  return {
    name: "",
    price,
    description: "",
  };
}

export function VariantRowsEditor({
  name = "variants",
  initialVariants = [],
  fallbackPrice = 0,
}: VariantRowsEditorProps) {
  const [rows, setRows] = useState<ProductVariant[]>(
    initialVariants.length > 0
      ? initialVariants.map((variant) => ({
          name: variant.name,
          price: variant.price,
          description: variant.description ?? "",
        }))
      : createDefaultVariants(fallbackPrice),
  );

  return (
    <div className="grid gap-4">
      <input name={name} type="hidden" value={JSON.stringify(rows)} />

      <p className="text-sm text-neutral-600">
        Default versions: AAAAA Clone, 1:1 Clone, and Top 1:1 Clone. Set a
        different price for each — the product page updates the price when a
        customer picks a version.
      </p>

      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:grid-cols-[1fr_140px_auto] sm:items-end"
            key={`variant-${index}`}
          >
            <Field label="Version name">
              <input
                className={inputClassName}
                onChange={(event) => {
                  const value = event.target.value;
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, name: value } : item,
                    ),
                  );
                }}
                placeholder="e.g. AAAAA Clone"
                value={row.name}
              />
            </Field>
            <Field label="Price">
              <input
                className={inputClassName}
                min="0"
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? {
                            ...item,
                            price: Number.isFinite(value) ? value : 0,
                          }
                        : item,
                    ),
                  );
                }}
                step="0.01"
                type="number"
                value={row.price}
              />
            </Field>
            <button
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-white disabled:opacity-40"
              disabled={rows.length <= 1}
              onClick={() => {
                setRows((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                );
              }}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-white"
          onClick={() => {
            setRows((current) => [
              ...current,
              createEmptyVariant(current[0]?.price ?? fallbackPrice),
            ]);
          }}
          type="button"
        >
          Add version
        </button>
        <button
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-white"
          onClick={() => {
            setRows(createDefaultVariants(fallbackPrice));
          }}
          type="button"
        >
          Reset to 3 defaults
        </button>
      </div>
    </div>
  );
}
