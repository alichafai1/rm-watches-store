const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "a",
]);

function isSafeInternalHref(href: string) {
  const value = href.trim();
  if (!value.startsWith("/") || value.startsWith("//")) {
    return false;
  }
  if (/[<>"'`]/.test(value) || /\s/.test(value)) {
    return false;
  }
  return true;
}

function readHrefAttribute(attributes: string) {
  const match = attributes.match(
    /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
  );
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isBoldElement(element: HTMLElement): boolean {
  const tag = element.tagName;
  if (tag === "B" || tag === "STRONG") {
    return true;
  }

  const weight = element.style.fontWeight;
  if (!weight) {
    return false;
  }

  if (weight === "bold" || weight === "bolder") {
    return true;
  }

  const numeric = Number.parseInt(weight, 10);
  return Number.isFinite(numeric) && numeric >= 600;
}

function isItalicElement(element: HTMLElement): boolean {
  const tag = element.tagName;
  if (tag === "I" || tag === "EM") {
    return true;
  }

  return element.style.fontStyle === "italic";
}

function serializeNode(node: Node, bold = false, italic = false): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (!text) {
      return "";
    }

    let output = escapeHtml(text);
    if (italic) {
      output = `<em>${output}</em>`;
    }
    if (bold) {
      output = `<strong>${output}</strong>`;
    }
    return output;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const nextBold = bold || isBoldElement(element);
  const nextItalic = italic || isItalicElement(element);
  const children = Array.from(element.childNodes)
    .map((child) => serializeNode(child, nextBold, nextItalic))
    .join("");

  if (tag === "br") {
    return "<br />";
  }

  if (tag === "p" || tag === "div") {
    const content = children.trim() ? children : "<br />";
    return `<p>${content}</p>`;
  }

  if (tag === "li") {
    return `<li>${children}</li>`;
  }

  if (tag === "ul" || tag === "ol") {
    return `<${tag}>${children}</${tag}>`;
  }

  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
    return `<p><strong>${children}</strong></p>`;
  }

  if (tag === "a") {
    const href = element.getAttribute("href") ?? "";
    if (!isSafeInternalHref(href) || !children) {
      return children;
    }
    return `<a href="${escapeHtml(href)}">${children}</a>`;
  }

  return children;
}

function sanitizeWithDom(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const serialized = Array.from(doc.body.childNodes)
    .map((node) => serializeNode(node))
    .join("");

  return normalizeAboutHtmlStructure(serialized);
}

function sanitizeWithRegex(html: string): string {
  let cleaned = html
    .replace(/<\/(?:script|style|iframe|object|embed|form)[^>]*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/ on[a-z]+="[^"]*"/gi, "")
    .replace(/ on[a-z]+='[^']*'/gi, "")
    .replace(/ javascript:/gi, "");

  cleaned = cleaned.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, inner) => {
    const href = readHrefAttribute(String(attrs ?? ""));
    if (!isSafeInternalHref(href)) {
      return inner;
    }
    return `<a href="${escapeHtml(href)}">${inner}</a>`;
  });

  cleaned = cleaned.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, rawTag) => {
    const tag = String(rawTag).toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (tag === "br") {
      return "<br />";
    }

    if (tag === "b") {
      return isClosing ? "</strong>" : "<strong>";
    }

    if (tag === "i") {
      return isClosing ? "</em>" : "<em>";
    }

    if (tag === "a") {
      if (isClosing) return "</a>";
      const href = readHrefAttribute(match);
      return isSafeInternalHref(href) ? `<a href="${escapeHtml(href)}">` : "";
    }

    return isClosing ? `</${tag}>` : `<${tag}>`;
  });

  return normalizeAboutHtmlStructure(cleaned);
}

function normalizeAboutHtmlStructure(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) {
    return "";
  }

  // Wrap bare text/inline content in paragraphs when needed.
  if (!/<(p|ul|ol)\b/i.test(trimmed)) {
    return `<p>${trimmed}</p>`;
  }

  return trimmed
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

export function plainTextToAboutHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return "";
  }

  return normalized
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const withBreaks = escapeHtml(paragraph).replace(/\n/g, "<br />");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

/** Sanitize pasted/saved about HTML. Keeps paragraphs, line breaks, bold, italics, lists, and internal links. */
export function sanitizeAboutHtml(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  const value = input.trim();
  if (!value) {
    return "";
  }

  if (!/<[a-z][\s\S]*>/i.test(value)) {
    return plainTextToAboutHtml(value);
  }

  if (typeof DOMParser !== "undefined") {
    return sanitizeWithDom(value);
  }

  return sanitizeWithRegex(value);
}

/** Normalize stored about text/HTML for safe storefront rendering. */
export function normalizeAboutHtml(input: string): string {
  return sanitizeAboutHtml(input);
}

/** Plain-text fallback (SEO / attributes). */
export function aboutHtmlToPlainText(html: string): string {
  return sanitizeAboutHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
