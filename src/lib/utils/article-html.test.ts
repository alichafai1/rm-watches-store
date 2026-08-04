import { describe, expect, it } from "vitest";
import {
  articleBlocksToHtml,
  articleHtmlToBlocks,
  extractEmbeddedArticleBlocks,
  parseAndSanitizeArticleBlocks,
  sanitizeArticleInlineHtml,
  serializeArticleContent,
} from "@/lib/utils/article-html";
import type { ArticleContentBlock } from "@/types/article";

function asFormValue(blocks: ArticleContentBlock[]) {
  return JSON.stringify(blocks);
}

describe("structured article content", () => {
  it("round-trips semantic text, images, dimensions, alt text, and captions", () => {
    const blocks: ArticleContentBlock[] = [
      { id: "heading", type: "heading", level: 2, text: "Watch materials" },
      {
        id: "paragraph",
        type: "paragraph",
        html: 'Choose <strong>carbon</strong> and <a href="/shop">browse watches</a>.',
      },
      {
        id: "image",
        type: "image",
        url: "https://example.com/watch.webp",
        alt: "Carbon watch case viewed from the front",
        caption: "A lightweight carbon case",
        width: 1600,
        height: 900,
      },
    ];

    const html = articleBlocksToHtml(blocks);
    expect(html).toContain("<h2>Watch materials</h2>");
    expect(html).toContain('href="/shop"');
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain("<figure>");
    expect(html).toContain('width="1600" height="900"');
    expect(html).toContain("<figcaption>A lightweight carbon case</figcaption>");

    const restored = articleHtmlToBlocks(html);
    expect(restored.map((block) => ({ ...block, id: "normalized" }))).toEqual(
      blocks.map((block) => ({ ...block, id: "normalized" })),
    );
  });

  it("keeps internal links same-tab and secures external links", () => {
    expect(sanitizeArticleInlineHtml('<a href="/guides">Guides</a>')).toBe(
      '<a href="/guides">Guides</a>',
    );
    expect(
      sanitizeArticleInlineHtml(
        '<a href="https://example.com/article">External</a>',
      ),
    ).toContain('rel="noopener noreferrer" target="_blank"');
  });

  it("preserves structured blocks when the JSONB column is unavailable", () => {
    const blocks: ArticleContentBlock[] = [
      { id: "intro", type: "paragraph", html: "Introduction" },
      {
        id: "photo",
        type: "image",
        url: "https://example.com/watch.webp",
        alt: "Detailed watch movement",
        caption: "Movement detail",
        width: 1200,
        height: 800,
      },
    ];
    const stored = serializeArticleContent(blocks);
    expect(stored).toContain("<!-- article-blocks:");
    expect(extractEmbeddedArticleBlocks(stored)).toEqual(blocks);
  });

  it("removes unsafe inline markup", () => {
    const clean = sanitizeArticleInlineHtml(
      '<script>alert(1)</script><strong onclick="bad()">Safe</strong>',
    );
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("<strong>Safe</strong>");
  });

  it("requires SEO image fields before publishing", () => {
    const blocks: ArticleContentBlock[] = [
      {
        id: "image",
        type: "image",
        url: "https://example.com/watch.webp",
        alt: "",
        width: 0,
        height: 0,
      },
    ];
    expect(() =>
      parseAndSanitizeArticleBlocks(asFormValue(blocks), "published"),
    ).toThrow(/descriptive alt text, width, and height/i);
    expect(() =>
      parseAndSanitizeArticleBlocks(asFormValue(blocks), "draft"),
    ).not.toThrow();
  });

  it("rejects duplicate IDs and unsafe image URLs", () => {
    const duplicate: ArticleContentBlock[] = [
      { id: "same", type: "heading", level: 2, text: "One" },
      { id: "same", type: "paragraph", html: "Two" },
    ];
    expect(() =>
      parseAndSanitizeArticleBlocks(asFormValue(duplicate), "draft"),
    ).toThrow(/IDs must be unique/i);

    const unsafe: ArticleContentBlock[] = [
      {
        id: "unsafe",
        type: "image",
        url: "javascript:alert(1)",
        alt: "Unsafe",
        width: 100,
        height: 100,
      },
    ];
    expect(() =>
      parseAndSanitizeArticleBlocks(asFormValue(unsafe), "draft"),
    ).toThrow(/HTTP or HTTPS/i);
  });

  it("enforces a valid published heading hierarchy", () => {
    const blocks: ArticleContentBlock[] = [
      { id: "subsection", type: "heading", level: 3, text: "Details" },
      { id: "copy", type: "paragraph", html: "Useful content" },
    ];
    expect(() =>
      parseAndSanitizeArticleBlocks(asFormValue(blocks), "published"),
    ).toThrow(/H3 subsection must come after an H2/i);
  });
});
