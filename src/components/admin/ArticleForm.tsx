import Link from "next/link";
import {
  Field,
  inputClassName,
  textareaClassName,
} from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  deleteArticleAction,
  saveArticleAction,
} from "@/lib/admin/actions";
import { ArticleRichTextEditor } from "@/components/admin/ArticleRichTextEditor";
import {
  articleHtmlToBlocks,
  extractEmbeddedArticleBlocks,
} from "@/lib/utils/article-html";
import type { CmsArticleRecord } from "@/types/cms";

type ArticleFormProps = {
  article?: CmsArticleRecord | null;
};

export function ArticleForm({ article }: ArticleFormProps) {
  return (
    <form action={saveArticleAction} className="grid gap-6">
      {article ? <input name="id" type="hidden" value={article.id} /> : null}
      <input
        name="category"
        type="hidden"
        value={article?.category ?? "company"}
      />

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div>
          <h2 className="text-lg font-semibold">Article details</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Choose Blog or Guide to control where this content appears.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (recommended: 50–60 characters)">
            <input
              className={inputClassName}
              defaultValue={article?.title ?? ""}
              maxLength={100}
              name="title"
              required
            />
          </Field>
          <Field label="Slug (leave blank to generate from title)">
            <input
              className={inputClassName}
              defaultValue={article?.slug ?? ""}
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="how-to-choose-a-watch"
            />
          </Field>
          <Field label="Type">
            <select
              className={inputClassName}
              defaultValue={article?.type ?? "blog"}
              name="type"
            >
              <option value="blog">Blog</option>
              <option value="guide">Guide</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              className={inputClassName}
              defaultValue={article?.status ?? "draft"}
              name="status"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <Field label="Short summary (recommended: 120–200 characters)">
          <textarea
            className={textareaClassName}
            defaultValue={article?.excerpt ?? ""}
            maxLength={300}
            name="excerpt"
            placeholder="A clear one- or two-sentence summary shown on cards and below the article title."
            required
          />
        </Field>
        <Field label="Main content">
          <p className="-mt-1 mb-2 text-xs leading-5 text-neutral-500">
            Use one clear H2 for each main topic and H3 for subsections. Add
            descriptive links and alt text to every image.
          </p>
          <ArticleRichTextEditor
            initialBlocks={
              article?.content_blocks?.length
                ? article.content_blocks
                : extractEmbeddedArticleBlocks(article?.content ?? "") ??
                  articleHtmlToBlocks(article?.content ?? "")
            }
            name="content_blocks"
          />
        </Field>
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Cover image</h2>
        <p className="text-sm text-neutral-600">
          Required when publishing. It appears on the homepage, listings,
          article page, and social previews. Add descriptive alt text.
        </p>
        <ImageUploader
          initialImages={article?.cover_image ? [article.cover_image] : []}
          multiple={false}
          name="cover_image"
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">SEO</h2>
        <p className="text-sm leading-6 text-neutral-600">
          These fields control how the page can appear in search results. Leave
          them blank to use the article title and short summary automatically.
        </p>
        <Field label="SEO title (recommended: 50–60 characters)">
          <input
            className={inputClassName}
            defaultValue={article?.seo_title ?? ""}
            maxLength={70}
            name="seo_title"
          />
        </Field>
        <Field label="SEO description (recommended: 140–160 characters)">
          <textarea
            className={textareaClassName}
            defaultValue={article?.seo_description ?? ""}
            maxLength={180}
            name="seo_description"
          />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          type="submit"
        >
          Save article
        </button>
        <Link
          className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-white"
          href="/admin/blogs"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  return (
    <form action={deleteArticleAction} className="mt-4">
      <input name="id" type="hidden" value={articleId} />
      <button
        className="text-sm font-medium text-red-600 hover:underline"
        type="submit"
      >
        Delete article
      </button>
    </form>
  );
}
