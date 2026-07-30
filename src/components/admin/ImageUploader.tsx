"use client";

import { useId, useRef, useState } from "react";
import { uploadAdminImageAction } from "@/lib/admin/actions";
import type { ProductImage } from "@/types/product";

type ImageUploaderProps = {
  name: string;
  initialImages?: ProductImage[];
  multiple?: boolean;
};

export function ImageUploader({
  name,
  initialImages = [],
  multiple = true,
}: ImageUploaderProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploaded: ProductImage[] = [];

      for (const file of Array.from(fileList)) {
        const body = new FormData();
        body.set("file", file);
        const result = await uploadAdminImageAction(body);

        if ("error" in result && result.error) {
          setError(result.error);
          continue;
        }

        if ("url" in result && result.url) {
          uploaded.push({
            url: result.url,
            alt: "",
            width: result.width || 1024,
            height: result.height || 1024,
          });
        }
      }

      setImages((current) =>
        multiple ? [...current, ...uploaded] : uploaded.slice(0, 1),
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function updateAlt(url: string, alt: string) {
    setImages((current) =>
      current.map((image) => (image.url === url ? { ...image, alt } : image)),
    );
  }

  function removeImage(url: string) {
    setImages((current) => current.filter((image) => image.url !== url));
  }

  function moveImage(fromIndex: number, toIndex: number) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= images.length ||
      toIndex >= images.length
    ) {
      return;
    }

    setImages((current) => {
      const next = [...current];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }

  function moveImageUp(index: number) {
    moveImage(index, index - 1);
  }

  function moveImageDown(index: number) {
    moveImage(index, index + 1);
  }

  function clearReorderDrag() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div className="grid gap-4">
      <input
        name={name}
        type="hidden"
        value={
          multiple
            ? JSON.stringify(images)
            : images[0]
              ? JSON.stringify(images[0])
              : ""
        }
      />

      <div
        className={
          isDragging
            ? "rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-100 px-4 py-8 text-center"
            : "rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center"
        }
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void onUpload(event.dataTransfer.files);
        }}
      >
        <p className="text-sm font-medium text-neutral-950">
          {uploading ? "Uploading…" : "Drop images here or browse"}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          PNG, JPG, WEBP, or GIF · max 5MB each
        </p>
        <label
          className="mt-4 inline-flex cursor-pointer rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          htmlFor={inputId}
        >
          {multiple ? "Add images" : "Choose image"}
        </label>
        <input
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          id={inputId}
          multiple={multiple}
          onChange={(event) => onUpload(event.target.files)}
          ref={fileInputRef}
          type="file"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div className="grid gap-3">
          {multiple && images.length > 1 ? (
            <p className="text-sm text-neutral-600">
              Drag images or use the arrows to set order. Image 1 is the main
              product photo.
            </p>
          ) : null}

          <ul className="grid gap-3">
            {images.map((image, index) => {
              const isDropTarget =
                dropIndex === index && dragIndex !== null && dragIndex !== index;

              return (
                <li
                  className={
                    isDropTarget
                      ? "grid gap-3 rounded-xl border-2 border-neutral-900 bg-neutral-50 p-3 sm:grid-cols-[auto_120px_1fr]"
                      : "grid gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:grid-cols-[auto_120px_1fr]"
                  }
                  draggable={multiple && images.length > 1}
                  key={image.url}
                  onDragEnd={clearReorderDrag}
                  onDragLeave={() => {
                    setDropIndex((current) =>
                      current === index ? null : current,
                    );
                  }}
                  onDragOver={(event) => {
                    if (dragIndex === null || dragIndex === index) {
                      return;
                    }

                    event.preventDefault();
                    setDropIndex(index);
                  }}
                  onDragStart={(event) => {
                    if (!multiple || images.length < 2) {
                      return;
                    }

                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", String(index));
                    setDragIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (dragIndex === null) {
                      return;
                    }

                    moveImage(dragIndex, index);
                    clearReorderDrag();
                  }}
                >
                  {multiple && images.length > 1 ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span
                        aria-hidden="true"
                        className="cursor-grab select-none px-1 text-neutral-400 active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        ⋮⋮
                      </span>
                      <button
                        aria-label={`Move image ${index + 1} up`}
                        className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 hover:border-neutral-950 disabled:opacity-30"
                        disabled={index === 0}
                        onClick={() => moveImageUp(index)}
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        aria-label={`Move image ${index + 1} down`}
                        className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 hover:border-neutral-950 disabled:opacity-30"
                        disabled={index === images.length - 1}
                        onClick={() => moveImageDown(index)}
                        type="button"
                      >
                        ↓
                      </button>
                    </div>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={image.alt || `Upload preview ${index + 1}`}
                      className="aspect-square w-full object-contain p-2"
                      draggable={false}
                      src={image.url}
                    />
                  </div>
                  <div className="grid gap-2 content-start">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      Image {index + 1}
                      {index === 0 ? " · Main" : ""}
                    </p>
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium text-neutral-800">
                        Alt text
                      </span>
                      <input
                        className="min-h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-500"
                        onChange={(event) =>
                          updateAlt(image.url, event.target.value)
                        }
                        placeholder="Describe the watch for SEO and accessibility"
                        value={image.alt}
                      />
                    </label>
                    <button
                      className="justify-self-start text-sm font-medium text-red-600 hover:underline"
                      onClick={() => removeImage(image.url)}
                      type="button"
                    >
                      Remove image
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-neutral-500">No images added yet.</p>
      )}
    </div>
  );
}
