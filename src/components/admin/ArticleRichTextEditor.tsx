"use client";

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { uploadAdminImageAction } from "@/lib/admin/actions";
import type { ArticleContentBlock } from "@/types/article";

type ArticleRichTextEditorProps = {
  initialBlocks?: ArticleContentBlock[];
  name: string;
};

const toolbarButton =
  "rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-800 hover:border-neutral-950 aria-pressed:border-neutral-950 aria-pressed:bg-neutral-950 aria-pressed:text-white disabled:opacity-40";

function blockId() {
  return crypto.randomUUID();
}

function newBlock(type: ArticleContentBlock["type"]): ArticleContentBlock {
  const id = blockId();
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "paragraph":
      return { id, type, html: "" };
    case "list":
      return { id, type, style: "bullet", items: [""] };
    case "quote":
      return { id, type, html: "" };
    case "image":
      return { id, type, url: "", alt: "", width: 0, height: 0 };
  }
}

function InlineEditor({
  allowHeadings = false,
  value,
  onChange,
}: {
  allowHeadings?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    content: value,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        dropcursor: false,
        hardBreak: false,
        heading: allowHeadings ? { levels: [2, 3] } : false,
        horizontalRule: false,
        link: false,
        listItem: false,
        orderedList: false,
        strike: false,
        underline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class:
          "article-editor min-h-20 rounded-b-md border border-t-0 border-neutral-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-neutral-500",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", current ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) {
    return <div className="min-h-20 rounded-md border border-neutral-300 bg-white" />;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-md border border-neutral-300 bg-neutral-50 p-1.5">
        {allowHeadings ? (
          <>
            <button
              className={toolbarButton}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor.chain().focus().setParagraph().run()}
              aria-pressed={editor.isActive("paragraph")}
              type="button"
            >
              Paragraph
            </button>
            <button
              className={toolbarButton}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              aria-pressed={editor.isActive("heading", { level: 2 })}
              type="button"
            >
              H2
            </button>
            <button
              className={toolbarButton}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              aria-pressed={editor.isActive("heading", { level: 3 })}
              type="button"
            >
              H3
            </button>
          </>
        ) : null}
        <button
          className={toolbarButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive("bold")}
          type="button"
        >
          Bold
        </button>
        <button
          className={toolbarButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive("italic")}
          type="button"
        >
          Italic
        </button>
        <button
          className={toolbarButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-pressed={editor.isActive("underline")}
          type="button"
        >
          Underline
        </button>
        <button
          className={toolbarButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={setLink}
          aria-pressed={editor.isActive("link")}
          type="button"
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export function ArticleRichTextEditor({
  initialBlocks = [],
  name,
}: ArticleRichTextEditorProps) {
  const batchInputRef = useRef<HTMLInputElement>(null);
  const replacementInputRef = useRef<HTMLInputElement>(null);
  const replacementIdRef = useRef<string | null>(null);
  const [blocks, setBlocks] = useState<ArticleContentBlock[]>(
    initialBlocks.length > 0
      ? initialBlocks
      : [{ id: "initial-paragraph", type: "paragraph", html: "" }],
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function updateBlock(id: string, update: Partial<ArticleContentBlock>) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? ({ ...block, ...update } as ArticleContentBlock) : block,
      ),
    );
  }

  function moveBlock(from: number, to: number) {
    if (to < 0 || to >= blocks.length || from === to) return;
    setBlocks((current) => {
      const next = [...current];
      const [block] = next.splice(from, 1);
      next.splice(to, 0, block);
      return next;
    });
  }

  function duplicateBlock(index: number) {
    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, { ...current[index], id: blockId() });
      return next;
    });
  }

  async function uploadFiles(files: FileList | null, replaceId?: string) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const uploaded: ArticleContentBlock[] = [];

    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const result = await uploadAdminImageAction(body);
        if ("error" in result) {
          setError(result.error ?? "Image upload failed.");
          continue;
        }
        uploaded.push({
          id: blockId(),
          type: "image",
          url: result.url,
          alt: "",
          width: result.width,
          height: result.height,
        });
      }

      if (replaceId && uploaded[0]?.type === "image") {
        const image = uploaded[0];
        setBlocks((current) =>
          current.map((block) =>
            block.id === replaceId && block.type === "image"
              ? { ...block, url: image.url, width: image.width, height: image.height }
              : block,
          ),
        );
      } else if (uploaded.length) {
        setBlocks((current) => [...current, ...uploaded]);
      }
    } finally {
      setUploading(false);
      if (batchInputRef.current) batchInputRef.current.value = "";
      if (replacementInputRef.current) replacementInputRef.current.value = "";
      replacementIdRef.current = null;
    }
  }

  return (
    <div className="grid gap-4">
      <input name={name} type="hidden" value={JSON.stringify(blocks)} />
      <input
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        multiple
        onChange={(event) => void uploadFiles(event.target.files)}
        ref={batchInputRef}
        type="file"
      />
      <input
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(event) =>
          void uploadFiles(event.target.files, replacementIdRef.current ?? undefined)
        }
        ref={replacementInputRef}
        type="file"
      />

      <div className="flex flex-wrap gap-2">
        {(["paragraph", "list", "quote"] as const).map((type) => (
          <button
            className={toolbarButton}
            key={type}
            onClick={() => setBlocks((current) => [...current, newBlock(type)])}
            type="button"
          >
            Add {type}
          </button>
        ))}
        <button
          className={toolbarButton}
          disabled={uploading}
          onClick={() => batchInputRef.current?.click()}
          type="button"
        >
          {uploading ? "Uploading…" : "Add body images"}
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <ol className="grid gap-3">
        {blocks.map((block, index) => (
          <li
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
            key={block.id}
            onDragEnd={() => setDragIndex(null)}
            onDragOver={(event) => {
              if (dragIndex !== null && dragIndex !== index) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) moveBlock(dragIndex, index);
              setDragIndex(null);
            }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                aria-hidden="true"
                className="cursor-grab select-none text-neutral-400"
                draggable
                onDragStart={() => setDragIndex(index)}
                title="Drag to reorder"
              >
                ⋮⋮
              </span>
              <span className="mr-auto text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {index + 1}. {block.type}
              </span>
              <button
                aria-label={`Move block ${index + 1} up`}
                className={toolbarButton}
                disabled={index === 0}
                onClick={() => moveBlock(index, index - 1)}
                type="button"
              >
                ↑
              </button>
              <button
                aria-label={`Move block ${index + 1} down`}
                className={toolbarButton}
                disabled={index === blocks.length - 1}
                onClick={() => moveBlock(index, index + 1)}
                type="button"
              >
                ↓
              </button>
              <button
                className={toolbarButton}
                onClick={() => duplicateBlock(index)}
                type="button"
              >
                Duplicate
              </button>
              <button
                className="px-2 text-xs font-medium text-red-700 hover:underline"
                onClick={() =>
                  setBlocks((current) => current.filter((item) => item.id !== block.id))
                }
                type="button"
              >
                Remove block
              </button>
            </div>

            {block.type === "heading" ? (
              <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
                <select
                  className="rounded-md border border-neutral-300 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateBlock(block.id, { level: Number(event.target.value) as 2 | 3 })
                  }
                  value={block.level}
                >
                  <option value={2}>H2 · Main section</option>
                  <option value={3}>H3 · Subsection</option>
                </select>
                <input
                  className="min-h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                  onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                  placeholder={
                    block.level === 2
                      ? "Main section title"
                      : "Subsection title"
                  }
                  value={block.text}
                />
              </div>
            ) : null}

            {block.type === "paragraph" ? (
              <InlineEditor
                allowHeadings
                onChange={(html) => updateBlock(block.id, { html })}
                value={block.html}
              />
            ) : null}

            {block.type === "quote" ? (
              <InlineEditor
                onChange={(html) => updateBlock(block.id, { html })}
                value={block.html}
              />
            ) : null}

            {block.type === "list" ? (
              <div className="grid gap-2">
                <select
                  className="min-h-10 justify-self-start rounded-md border border-neutral-300 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateBlock(block.id, {
                      style: event.target.value as "bullet" | "ordered",
                    })
                  }
                  value={block.style}
                >
                  <option value="bullet">Bulleted list</option>
                  <option value="ordered">Numbered list</option>
                </select>
                {block.items.map((item, itemIndex) => (
                  <div className="grid grid-cols-[1fr_auto] gap-2" key={itemIndex}>
                    <InlineEditor
                      onChange={(html) => {
                        const items = [...block.items];
                        items[itemIndex] = html;
                        updateBlock(block.id, { items });
                      }}
                      value={item}
                    />
                    <button
                      className="self-start px-2 py-2 text-xs font-medium text-red-700"
                      onClick={() =>
                        updateBlock(block.id, {
                          items: block.items.filter((_, current) => current !== itemIndex),
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className={`${toolbarButton} justify-self-start`}
                  onClick={() => updateBlock(block.id, { items: [...block.items, ""] })}
                  type="button"
                >
                  Add list item
                </button>
              </div>
            ) : null}

            {block.type === "image" ? (
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                  {block.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={block.alt || "Body image preview"}
                      className="aspect-square w-full object-contain p-2"
                      src={block.url}
                    />
                  ) : (
                    <div className="grid aspect-square place-items-center text-xs text-neutral-500">
                      No image selected
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Alt text</span>
                    <input
                      className="min-h-10 rounded-md border border-neutral-300 bg-white px-3"
                      onChange={(event) => updateBlock(block.id, { alt: event.target.value })}
                      value={block.alt}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Caption (optional)</span>
                    <input
                      className="min-h-10 rounded-md border border-neutral-300 bg-white px-3"
                      onChange={(event) =>
                        updateBlock(block.id, { caption: event.target.value })
                      }
                      value={block.caption ?? ""}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium">Width</span>
                      <input
                        className="min-h-10 rounded-md border border-neutral-300 bg-white px-3"
                        min={0}
                        onChange={(event) =>
                          updateBlock(block.id, { width: Number(event.target.value) || 0 })
                        }
                        type="number"
                        value={block.width}
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium">Height</span>
                      <input
                        className="min-h-10 rounded-md border border-neutral-300 bg-white px-3"
                        min={0}
                        onChange={(event) =>
                          updateBlock(block.id, { height: Number(event.target.value) || 0 })
                        }
                        type="number"
                        value={block.height}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={toolbarButton}
                      disabled={uploading}
                      onClick={() => {
                        replacementIdRef.current = block.id;
                        replacementInputRef.current?.click();
                      }}
                      type="button"
                    >
                      Replace image
                    </button>
                    <button
                      className="px-2 text-xs font-medium text-red-700 hover:underline"
                      onClick={() =>
                        updateBlock(block.id, { url: "", width: 0, height: 0 })
                      }
                      type="button"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {blocks.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No content blocks yet. Add a block above.
        </p>
      ) : null}
    </div>
  );
}
