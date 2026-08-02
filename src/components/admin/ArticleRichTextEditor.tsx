"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { uploadAdminImageAction } from "@/lib/admin/actions";

type ArticleRichTextEditorProps = {
  initialContent?: string;
  name: string;
};

const toolbarButton =
  "rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-800 hover:border-neutral-950 disabled:opacity-40";

export function ArticleRichTextEditor({
  initialContent = "",
  name,
}: ArticleRichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(initialContent);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    content: initialContent,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          loading: "lazy",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "article-editor min-h-80 rounded-b-lg border border-t-0 border-neutral-300 bg-white px-4 py-4 text-sm leading-7 text-neutral-900 outline-none focus:border-neutral-500",
      },
    },
    onUpdate({ editor: currentEditor }) {
      setContent(currentEditor.getHTML());
    },
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

  async function uploadImage(file: File | undefined) {
    if (!file || !editor) return;
    const alt = window.prompt(
      "Describe this image for accessibility and image SEO",
    )?.trim();
    if (!alt) {
      setError("Image alt text is required.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const result = await uploadAdminImageAction(body);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if ("url" in result && result.url) {
        editor
          .chain()
          .focus()
          .setImage({ src: result.url, alt, title: alt })
          .run();
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!editor) {
    return <div className="min-h-80 rounded-lg border border-neutral-300 bg-white" />;
  }

  return (
    <div>
      <input name={name} type="hidden" value={content} />
      <div className="flex flex-wrap gap-2 rounded-t-lg border border-neutral-300 bg-neutral-50 p-2">
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().setParagraph().run()}
          type="button"
        >
          Paragraph
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
        >
          H2
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          type="button"
        >
          H3
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          Bold
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
        >
          Italic
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          Bullets
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          Numbered
        </button>
        <button
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type="button"
        >
          Quote
        </button>
        <button className={toolbarButton} onClick={setLink} type="button">
          Link
        </button>
        <button
          className={toolbarButton}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          {uploading ? "Uploading…" : "Image"}
        </button>
        <button
          className={toolbarButton}
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          Undo
        </button>
        <button
          className={toolbarButton}
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
        >
          Redo
        </button>
        <input
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => void uploadImage(event.target.files?.[0])}
          ref={fileInputRef}
          type="file"
        />
      </div>
      <EditorContent editor={editor} />
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
