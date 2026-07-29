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
import type { CmsArticleRecord } from "@/types/cms";

type ArticleFormProps = {
  article?: CmsArticleRecord | null;
};

export function ArticleForm({ article }: ArticleFormProps) {
  return (
    <form action={saveArticleAction} className="grid gap-6">
      {article ? <input name="id" type="hidden" value={article.id} /> : null}

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={inputClassName}
              defaultValue={article?.title ?? ""}
              name="title"
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClassName}
              defaultValue={article?.slug ?? ""}
              name="slug"
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
          <Field label="Category">
            <select
              className={inputClassName}
              defaultValue={article?.category ?? "company"}
              name="category"
            >
              <option value="buying-guide">Buying guide</option>
              <option value="watch-care">Watch care</option>
              <option value="style">Style</option>
              <option value="education">Education</option>
              <option value="company">Company</option>
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
        <Field label="Excerpt">
          <textarea
            className={textareaClassName}
            defaultValue={article?.excerpt ?? ""}
            name="excerpt"
          />
        </Field>
        <Field label="Content">
          <textarea
            className={`${textareaClassName} min-h-56`}
            defaultValue={article?.content ?? ""}
            name="content"
          />
        </Field>
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Cover image</h2>
        <p className="text-sm text-neutral-600">
          Upload a cover image and add alt text. It is used on the blog page and
          in listings.
        </p>
        <ImageUploader
          initialImages={article?.cover_image ? [article.cover_image] : []}
          multiple={false}
          name="cover_image"
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">SEO</h2>
        <Field label="SEO title">
          <input
            className={inputClassName}
            defaultValue={article?.seo_title ?? ""}
            name="seo_title"
          />
        </Field>
        <Field label="SEO description">
          <textarea
            className={textareaClassName}
            defaultValue={article?.seo_description ?? ""}
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
