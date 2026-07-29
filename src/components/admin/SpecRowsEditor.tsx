"use client";

import { useState } from "react";
import { inputClassName, textareaClassName } from "@/components/admin/Field";
import { parseBulkSpecificationsText } from "@/lib/utils/specifications";
import type { ProductSpecification } from "@/types/product";

type SpecRowsEditorProps = {
  name?: string;
  initialSpecs?: ProductSpecification[];
};

function createEmptyRow(): ProductSpecification {
  return { label: "", value: "" };
}

export function SpecRowsEditor({
  name = "specifications",
  initialSpecs = [],
}: SpecRowsEditorProps) {
  const [rows, setRows] = useState<ProductSpecification[]>(
    initialSpecs.length > 0 ? initialSpecs : [createEmptyRow()],
  );
  const [bulkText, setBulkText] = useState("");
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  function applyBulkPaste(mode: "replace" | "append") {
    const parsed = parseBulkSpecificationsText(bulkText);

    if (parsed.length === 0) {
      setBulkMessage(
        "No specs found. Paste lines like: Brand[TAB]Richard Mille Replica",
      );
      return;
    }

    setRows((current) => {
      if (mode === "replace") {
        return parsed;
      }

      const existing = current.filter((row) => row.label.trim() || row.value.trim());
      return [...existing, ...parsed];
    });
    setBulkMessage(`Imported ${parsed.length} specifications.`);
    setBulkText("");
  }

  return (
    <div className="grid gap-4">
      <input name={name} type="hidden" value={JSON.stringify(rows)} />

      <div className="grid gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-medium text-neutral-950">
          Paste all specifications at once
        </p>
        <p className="text-xs text-neutral-600">
          Copy from Excel/Sheets or text. One line per spec. Examples:
          <br />
          <code className="text-[11px]">Brand[TAB]Richard Mille Replica</code>
          <br />
          <code className="text-[11px]">Movement: Tourbillon</code>
        </p>
        <textarea
          className={`${textareaClassName} min-h-40 bg-white`}
          onChange={(event) => {
            setBulkText(event.target.value);
            setBulkMessage(null);
          }}
          placeholder={`Brand\tRichard Mille Replica
Range\tRM 21
Model Number\tRM 21-01
Gender\tMens
Movement\tTourbillon
Crystal\tScratch Resistant Sapphire`}
          value={bulkText}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={() => applyBulkPaste("replace")}
            type="button"
          >
            Import & replace
          </button>
          <button
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
            onClick={() => applyBulkPaste("append")}
            type="button"
          >
            Import & add to list
          </button>
        </div>
        {bulkMessage ? (
          <p className="text-sm text-neutral-600">{bulkMessage}</p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-medium text-neutral-800">
          Spec rows (edit anytime)
        </p>
        {rows.map((row, index) => (
          <div
            className="grid gap-2 rounded-lg border border-neutral-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
            key={`spec-row-${index}`}
          >
            <input
              aria-label={`Specification name ${index + 1}`}
              className={inputClassName}
              onChange={(event) => {
                const label = event.target.value;
                setRows((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, label } : item,
                  ),
                );
              }}
              placeholder="Name (e.g. Movement)"
              value={row.label}
            />
            <input
              aria-label={`Specification value ${index + 1}`}
              className={inputClassName}
              onChange={(event) => {
                const value = event.target.value;
                setRows((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, value } : item,
                  ),
                );
              }}
              placeholder="Value (e.g. Automatic)"
              value={row.value}
            />
            <button
              className="min-h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
              disabled={rows.length === 1}
              onClick={() =>
                setRows((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              type="button"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          className="justify-self-start rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
          onClick={() => setRows((current) => [...current, createEmptyRow()])}
          type="button"
        >
          + Add a specification
        </button>
      </div>
    </div>
  );
}
