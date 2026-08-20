import { describe, expect, it } from "vitest";
import { sanitizeAboutHtml } from "@/lib/utils/rich-text";

describe("sanitizeAboutHtml internal links", () => {
  it("keeps crawlable internal blog and guide links", () => {
    const html =
      '<p>See the <a href="/blog/richard-mille-rm052-skull-replica-2026-review">RM 052 Skull replica review</a>.</p>';
    const cleaned = sanitizeAboutHtml(html);
    expect(cleaned).toContain(
      'href="/blog/richard-mille-rm052-skull-replica-2026-review"',
    );
    expect(cleaned).toContain("RM 052 Skull replica review");
  });

  it("strips javascript and external hrefs but keeps the link text", () => {
    expect(
      sanitizeAboutHtml('<p><a href="javascript:alert(1)">unsafe</a></p>'),
    ).toContain("unsafe");
    expect(
      sanitizeAboutHtml('<p><a href="javascript:alert(1)">unsafe</a></p>'),
    ).not.toContain("javascript");
    expect(
      sanitizeAboutHtml('<p><a href="https://example.com/x">external</a></p>'),
    ).toBe("<p>external</p>");
  });
});
