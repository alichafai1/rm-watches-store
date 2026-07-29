"use client";

import { useState } from "react";
import { Field, inputClassName, textareaClassName } from "@/components/admin/Field";
import type { ProductFaqItem } from "@/types/product";

type FaqRowsEditorProps = {
  name?: string;
  initialItems?: ProductFaqItem[];
};

function createEmptyFaq(): ProductFaqItem {
  return { question: "", answer: "" };
}

export function FaqRowsEditor({
  name = "faq",
  initialItems = [],
}: FaqRowsEditorProps) {
  const [rows, setRows] = useState<ProductFaqItem[]>(
    initialItems.length > 0
      ? initialItems.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))
      : [createEmptyFaq()],
  );

  return (
    <div className="grid gap-4">
      <input name={name} type="hidden" value={JSON.stringify(rows)} />

      <p className="text-sm text-neutral-600">
        Add questions and answers for this product. They appear in the FAQ
        section on the product page.
      </p>

      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            key={`faq-${index}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-neutral-800">
                FAQ {index + 1}
              </p>
              <button
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-white disabled:opacity-40"
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
            <Field label="Question">
              <input
                className={inputClassName}
                onChange={(event) => {
                  const question = event.target.value;
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, question } : item,
                    ),
                  );
                }}
                placeholder="e.g. What is the water resistance?"
                value={row.question}
              />
            </Field>
            <Field label="Answer">
              <textarea
                className={textareaClassName}
                onChange={(event) => {
                  const answer = event.target.value;
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, answer } : item,
                    ),
                  );
                }}
                placeholder="Write the answer customers will see"
                rows={3}
                value={row.answer}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        className="justify-self-start rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-white"
        onClick={() => {
          setRows((current) => [...current, createEmptyFaq()]);
        }}
        type="button"
      >
        Add FAQ
      </button>
    </div>
  );
}
