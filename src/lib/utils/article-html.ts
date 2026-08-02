import "server-only";
import sanitizeHtml from "sanitize-html";

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
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
    img: sanitizeHtml.simpleTransform("img", {
      loading: "lazy",
    }),
  },
};

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
