"use client";

import { useEffect, useId, useRef, useState, type ClipboardEvent } from "react";
import { sanitizeAboutHtml } from "@/lib/utils/rich-text";

type RichTextFieldProps = {
  name: string;
  defaultValue?: string;
  className?: string;
};

export function RichTextField({
  name,
  defaultValue = "",
  className = "",
}: RichTextFieldProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const editorId = useId();
  const [html, setHtml] = useState(() => sanitizeAboutHtml(defaultValue));

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || initializedRef.current) {
      return;
    }

    editor.innerHTML = html || "<p><br></p>";
    initializedRef.current = true;
  }, [html]);

  function syncFromEditor() {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    setHtml(sanitizeAboutHtml(editor.innerHTML));
  }

  function runCommand(command: "bold" | "italic") {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncFromEditor();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();

    const clipboardHtml = event.clipboardData.getData("text/html");
    const clipboardText = event.clipboardData.getData("text/plain");
    const cleaned = sanitizeAboutHtml(clipboardHtml || clipboardText);

    if (!cleaned) {
      return;
    }

    document.execCommand("insertHTML", false, cleaned);
    syncFromEditor();
  }

  return (
    <div className={`grid gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-950 transition hover:border-neutral-950"
          onMouseDown={(event) => {
            event.preventDefault();
            runCommand("bold");
          }}
          type="button"
        >
          Bold
        </button>
        <button
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs italic text-neutral-950 transition hover:border-neutral-950"
          onMouseDown={(event) => {
            event.preventDefault();
            runCommand("italic");
          }}
          type="button"
        >
          Italic
        </button>
        <span className="text-xs text-neutral-500">
          Paste from Word/Docs — bold and paragraphs are kept
        </span>
      </div>

      <div
        aria-multiline="true"
        className="min-h-48 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm leading-7 text-neutral-950 outline-none focus:border-neutral-500 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold"
        contentEditable
        id={editorId}
        onBlur={syncFromEditor}
        onInput={syncFromEditor}
        onPaste={handlePaste}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />

      <input name={name} type="hidden" value={html} />
    </div>
  );
}
