import "server-only";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { siteConfig } from "@/constants/site";
import type {
  ArticleContentBlock,
  PublicationStatus,
} from "@/types/article";

function isInternalArticleLink(href: string) {
  if (
    (href.startsWith("/") && !href.startsWith("//")) ||
    href.startsWith("#")
  ) {
    return true;
  }
  try {
    return new URL(href).origin === new URL(siteConfig.url).origin;
  } catch {
    return false;
  }
}

const transformArticleLink: sanitizeHtml.Transformer = (_tagName, attribs) => {
  const href = attribs.href?.trim() ?? "";
  const internal = isInternalArticleLink(href);
  const safeAttributes: sanitizeHtml.Attributes = internal
    ? { href }
    : { href, rel: "noopener noreferrer", target: "_blank" };
  return { tagName: "a", attribs: safeAttributes };
};

const inlineOptions: sanitizeHtml.IOptions = {
  allowedTags: ["br", "strong", "em", "a"],
  allowedAttributes: {
    a: ["href", "rel", "target"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: transformArticleLink,
  },
};

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "h2",
    "h3",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "rel", "target"],
    img: ["src", "alt", "title", "loading", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  transformTags: {
    a: transformArticleLink,
    img: sanitizeHtml.simpleTransform("img", {
      loading: "lazy",
    }),
  },
};

const inlineBlockSchema = z.object({
  id: z.string().trim().min(1).max(100),
  type: z.literal("paragraph"),
  html: z.string().max(50_000),
}).strict();

const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().trim().min(1).max(100),
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().max(500),
  }).strict(),
  inlineBlockSchema,
  z.object({
    id: z.string().trim().min(1).max(100),
    type: z.literal("list"),
    style: z.enum(["bullet", "ordered"]),
    items: z.array(z.string().max(10_000)).max(100),
  }).strict(),
  z.object({
    id: z.string().trim().min(1).max(100),
    type: z.literal("quote"),
    html: z.string().max(50_000),
  }).strict(),
  z.object({
    id: z.string().trim().min(1).max(100),
    type: z.literal("image"),
    url: z.string().trim().max(2_000),
    alt: z.string().trim().max(500),
    caption: z.string().trim().max(1_000).optional(),
    width: z.number().int().min(0).max(20_000),
    height: z.number().int().min(0).max(20_000),
  }).strict(),
]);

const articleBlocksSchema = z.array(articleBlockSchema).max(250);

export function sanitizeArticleInlineHtml(value: string) {
  return sanitizeHtml(value.trim(), inlineOptions);
}

export function sanitizeArticleHtml(value: string) {
  return sanitizeHtml(value.trim(), options);
}

export function articleHtmlToPlainText(value: string) {
  return sanitizeHtml(sanitizeArticleHtml(value), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hasText(value: string) {
  return articleHtmlToPlainText(value).length > 0;
}

function isSafeImageUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseAndSanitizeArticleBlocks(
  value: FormDataEntryValue | null,
  status: PublicationStatus,
): ArticleContentBlock[] {
  if (typeof value !== "string" || !value.trim()) {
    if (status === "published") {
      throw new Error("Main content is required before publishing.");
    }
    return [];
  }

  let input: unknown;
  try {
    input = JSON.parse(value);
  } catch {
    throw new Error("Article content blocks contain invalid JSON.");
  }

  const parsed = articleBlocksSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(
      `Invalid article block${issue?.path.length ? ` at ${issue.path.join(".")}` : ""}.`,
    );
  }
  if (new Set(parsed.data.map((block) => block.id)).size !== parsed.data.length) {
    throw new Error("Article block IDs must be unique.");
  }

  const blocks = parsed.data.map((block): ArticleContentBlock => {
    switch (block.type) {
      case "paragraph":
      case "quote":
        return { ...block, html: sanitizeArticleInlineHtml(block.html) };
      case "list":
        return {
          ...block,
          items: block.items.map(sanitizeArticleInlineHtml),
        };
      case "heading":
        return { ...block, text: block.text.trim() };
      case "image":
        if (!isSafeImageUrl(block.url)) {
          throw new Error("Body image URLs must use HTTP or HTTPS.");
        }
        return {
          ...block,
          url: sanitizeHtml(block.url, {
            allowedTags: [],
            allowedAttributes: {},
          }).trim(),
          alt: block.alt.trim(),
          caption: block.caption?.trim() || undefined,
        };
    }
  });

  if (status === "published") {
    const hasContent = blocks.some((block) => {
      if (block.type === "heading") return block.text.length > 0;
      if (block.type === "paragraph" || block.type === "quote") {
        return hasText(block.html);
      }
      if (block.type === "list") return block.items.some(hasText);
      return Boolean(block.url);
    });
    if (!hasContent) {
      throw new Error("Main content is required before publishing.");
    }

    let hasH2 = false;
    for (const block of blocks) {
      if (block.type === "heading" && !block.text) {
        throw new Error("Published headings cannot be empty.");
      }
      if (block.type === "heading" && block.level === 2) {
        hasH2 = true;
      }
      if (block.type === "heading" && block.level === 3 && !hasH2) {
        throw new Error("An H3 subsection must come after an H2 section.");
      }
      if (
        (block.type === "paragraph" || block.type === "quote") &&
        !hasText(block.html)
      ) {
        throw new Error(`Published ${block.type} blocks cannot be empty.`);
      }
      if (
        block.type === "list" &&
        (block.items.length === 0 || block.items.some((item) => !hasText(item)))
      ) {
        throw new Error("Published lists must contain only non-empty items.");
      }
      if (
        block.type === "image" &&
        (!block.url ||
          !block.alt ||
          block.width <= 0 ||
          block.height <= 0)
      ) {
        throw new Error(
          "Every published body image needs a URL, descriptive alt text, width, and height.",
        );
      }
    }
  }

  return blocks;
}

export function articleBlocksToHtml(blocks: ArticleContentBlock[]) {
  const html = blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return block.text
            ? `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`
            : "";
        case "paragraph":
          return hasText(block.html)
            ? `<p>${sanitizeArticleInlineHtml(block.html)}</p>`
            : "";
        case "quote":
          return hasText(block.html)
            ? `<blockquote>${sanitizeArticleInlineHtml(block.html)}</blockquote>`
            : "";
        case "list": {
          const tag = block.style === "ordered" ? "ol" : "ul";
          const items = block.items
            .filter(hasText)
            .map((item) => `<li>${sanitizeArticleInlineHtml(item)}</li>`)
            .join("");
          return items ? `<${tag}>${items}</${tag}>` : "";
        }
        case "image":
          if (!block.url) return "";
          return [
            "<figure>",
            `<img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt)}"`,
            ` width="${block.width}" height="${block.height}" loading="lazy">`,
            block.caption
              ? `<figcaption>${escapeHtml(block.caption)}</figcaption>`
              : "",
            "</figure>",
          ].join("");
      }
    })
    .filter(Boolean)
    .join("\n");

  return sanitizeArticleHtml(html);
}

const embeddedBlocksPattern =
  /<!--\s*article-blocks:([A-Za-z0-9_-]+)\s*-->\s*$/;

/** Stores a sanitized HTML fallback plus non-rendered structured metadata. */
export function serializeArticleContent(blocks: ArticleContentBlock[]) {
  const html = articleBlocksToHtml(blocks);
  const encoded = Buffer.from(JSON.stringify(blocks), "utf8").toString(
    "base64url",
  );
  return `${html}\n<!-- article-blocks:${encoded} -->`;
}

/** Reads the compatibility payload used before the JSONB migration is applied. */
export function extractEmbeddedArticleBlocks(
  value: string,
): ArticleContentBlock[] | undefined {
  const encoded = value.match(embeddedBlocksPattern)?.[1];
  if (!encoded) return undefined;

  try {
    const decoded = Buffer.from(encoded, "base64url").toString("utf8");
    return parseAndSanitizeArticleBlocks(decoded, "draft");
  } catch {
    return undefined;
  }
}

function readAttribute(attributes: string, name: string) {
  const match = attributes.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"),
  );
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function generatedBlockId(index: number) {
  return `legacy-${index + 1}`;
}

/** Converts legacy top-level article HTML into blocks when first opened. */
export function articleHtmlToBlocks(value: string): ArticleContentBlock[] {
  const clean = sanitizeArticleHtml(value);
  const blocks: ArticleContentBlock[] = [];
  const pattern =
    /<figure\b[^>]*>([\s\S]*?)<\/figure>|<(h2|h3|p|ul|ol|blockquote)\b([^>]*)>([\s\S]*?)<\/\2>|<img\b([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(clean))) {
    const figureInner = match[1] ?? "";
    const tag = match[2]?.toLowerCase();
    const inner = match[4] ?? "";
    const id = generatedBlockId(blocks.length);

    if (figureInner) {
      const image = figureInner.match(/<img\b([^>]*)\/?>/i);
      if (!image) continue;
      const attributes = image[1] ?? "";
      const caption = figureInner.match(
        /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i,
      );
      blocks.push({
        id,
        type: "image",
        url: readAttribute(attributes, "src"),
        alt: readAttribute(attributes, "alt"),
        caption: caption
          ? articleHtmlToPlainText(caption[1] ?? "") || undefined
          : undefined,
        width: Number(readAttribute(attributes, "width")) || 0,
        height: Number(readAttribute(attributes, "height")) || 0,
      });
    } else if (tag === "h2" || tag === "h3") {
      blocks.push({
        id,
        type: "heading",
        level: tag === "h2" ? 2 : 3,
        text: articleHtmlToPlainText(inner),
      });
    } else if (tag === "p") {
      const nestedImage = inner.match(/<img\b([^>]*)\/?>/i);
      if (nestedImage) {
        const attributes = nestedImage[1] ?? "";
        blocks.push({
          id,
          type: "image",
          url: readAttribute(attributes, "src"),
          alt: readAttribute(attributes, "alt"),
          width: Number(readAttribute(attributes, "width")) || 0,
          height: Number(readAttribute(attributes, "height")) || 0,
        });
      } else if (hasText(inner)) {
        blocks.push({ id, type: "paragraph", html: sanitizeArticleInlineHtml(inner) });
      }
    } else if (tag === "blockquote") {
      blocks.push({ id, type: "quote", html: sanitizeArticleInlineHtml(inner) });
    } else if (tag === "ul" || tag === "ol") {
      const items = Array.from(inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
        .map((item) => sanitizeArticleInlineHtml(item[1] ?? ""))
        .filter(hasText);
      blocks.push({
        id,
        type: "list",
        style: tag === "ol" ? "ordered" : "bullet",
        items,
      });
    } else {
      const attributes = match[5] ?? "";
      blocks.push({
        id,
        type: "image",
        url: readAttribute(attributes, "src"),
        alt: readAttribute(attributes, "alt"),
        width: Number(readAttribute(attributes, "width")) || 0,
        height: Number(readAttribute(attributes, "height")) || 0,
      });
    }
  }

  if (blocks.length === 0 && hasText(clean)) {
    blocks.push({
      id: generatedBlockId(0),
      type: "paragraph",
      html: sanitizeArticleInlineHtml(clean),
    });
  }

  return blocks;
}
