"use client";

import { useState } from "react";
import { Field, inputClassName, textareaClassName } from "@/components/admin/Field";
import type { ProductReview } from "@/types/product";

type ReviewRowsEditorProps = {
  name?: string;
  initialItems?: ProductReview[];
};

function createReviewId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyReview(): ProductReview {
  return {
    id: createReviewId(),
    author: "",
    rating: 5,
    title: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
  };
}

export function ReviewRowsEditor({
  name = "reviews",
  initialItems = [],
}: ReviewRowsEditorProps) {
  const [rows, setRows] = useState<ProductReview[]>(
    initialItems.length > 0
      ? initialItems.map((item) => ({
          id: item.id || createReviewId(),
          author: item.author,
          rating: item.rating,
          title: item.title,
          body: item.body,
          date: item.date,
        }))
      : [createEmptyReview()],
  );

  return (
    <div className="grid gap-4">
      <input name={name} type="hidden" value={JSON.stringify(rows)} />

      <p className="text-sm text-neutral-600">
        Add customer reviews for this product. They appear in the Customer
        Reviews section on the product page.
      </p>

      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            key={row.id}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-neutral-800">
                Review {index + 1}
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

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Author name">
                <input
                  className={inputClassName}
                  onChange={(event) => {
                    const author = event.target.value;
                    setRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, author } : item,
                      ),
                    );
                  }}
                  placeholder="e.g. James R."
                  value={row.author}
                />
              </Field>
              <Field label="Rating">
                <select
                  className={inputClassName}
                  onChange={(event) => {
                    const rating = Number(event.target.value);
                    setRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, rating } : item,
                      ),
                    );
                  }}
                  value={row.rating}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} / 5
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date">
                <input
                  className={inputClassName}
                  onChange={(event) => {
                    const date = event.target.value;
                    setRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, date } : item,
                      ),
                    );
                  }}
                  type="date"
                  value={row.date}
                />
              </Field>
            </div>

            <Field label="Review title">
              <input
                className={inputClassName}
                onChange={(event) => {
                  const title = event.target.value;
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, title } : item,
                    ),
                  );
                }}
                placeholder="e.g. Excellent quality"
                value={row.title}
              />
            </Field>

            <Field label="Review text">
              <textarea
                className={textareaClassName}
                onChange={(event) => {
                  const body = event.target.value;
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, body } : item,
                    ),
                  );
                }}
                placeholder="Write the full review customers will see"
                rows={3}
                value={row.body}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        className="justify-self-start rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-white"
        onClick={() => {
          setRows((current) => [...current, createEmptyReview()]);
        }}
        type="button"
      >
        Add review
      </button>
    </div>
  );
}
