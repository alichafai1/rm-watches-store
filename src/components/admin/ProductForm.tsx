import Link from "next/link";
import {
  Field,
  inputClassName,
  textareaClassName,
} from "@/components/admin/Field";
import {
  CollectionSelect,
  type AdminCollectionOption,
} from "@/components/admin/CollectionSelect";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SpecRowsEditor } from "@/components/admin/SpecRowsEditor";
import { VariantRowsEditor } from "@/components/admin/VariantRowsEditor";
import { FaqRowsEditor } from "@/components/admin/FaqRowsEditor";
import { ReviewRowsEditor } from "@/components/admin/ReviewRowsEditor";
import { RichTextField } from "@/components/admin/RichTextField";
import {
  deleteProductAction,
  saveProductAction,
} from "@/lib/admin/actions";
import type { CmsProductRecord } from "@/types/cms";
import { coerceSpecificationRows } from "@/lib/utils/specifications";
import type { ProductSpecification } from "@/types/product";

type ProductFormProps = {
  product?: CmsProductRecord | null;
  collections: AdminCollectionOption[];
};

function getInitialSpecRows(
  product?: CmsProductRecord | null,
): ProductSpecification[] {
  return coerceSpecificationRows(product?.specification_details);
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const initialSpecs = getInitialSpecRows(product);

  return (
    <form action={saveProductAction} className="grid gap-6">
      {product ? <input name="id" type="hidden" value={product.id} /> : null}

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={inputClassName}
              defaultValue={product?.title ?? ""}
              name="title"
              required
            />
          </Field>
          <Field label="Slug" hint="Leave blank to auto-generate from title">
            <input
              className={inputClassName}
              defaultValue={product?.slug ?? ""}
              name="slug"
            />
          </Field>
          <Field
            label="Base price"
            hint="This is the product price. If all version prices below are the same (or 0), they update to match this when you save."
          >
            <input
              className={inputClassName}
              defaultValue={product?.price ?? 0}
              min="0"
              name="price"
              step="0.01"
              type="number"
            />
          </Field>
          <Field
            label="Compare price"
            hint="Original/higher price shown with a strike-through. Leave empty if none."
          >
            <input
              className={inputClassName}
              defaultValue={product?.compare_at_price ?? ""}
              min="0"
              name="compare_at_price"
              placeholder="Optional"
              step="0.01"
              type="number"
            />
          </Field>
          <Field label="Currency">
            <select
              className={inputClassName}
              defaultValue={product?.currency ?? "USD"}
              name="currency"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              className={inputClassName}
              defaultValue={product?.status ?? "draft"}
              name="status"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Stock">
            <select
              className={inputClassName}
              defaultValue={product?.stock ?? "in_stock"}
              name="stock"
            >
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="preorder">Preorder</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              defaultChecked={product?.is_new_arrival ?? false}
              name="is_new_arrival"
              type="checkbox"
            />
            New arrival
          </label>
          <label className="flex items-center gap-2">
            <input
              defaultChecked={product?.is_best_seller ?? false}
              name="is_best_seller"
              type="checkbox"
            />
            Best seller
          </label>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Collection</h2>
        <p className="text-sm text-neutral-600">
          Choose which collection this product belongs to (about 3–4 products
          per collection).
        </p>
        <CollectionSelect
          collections={collections}
          initialId={product?.collection_id ?? ""}
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Gallery images</h2>
        <p className="text-sm text-neutral-600">
          Main product photos shown in the product gallery. Upload photos, set
          the order (first image is main), then write alt text for each one.
        </p>
        <ImageUploader
          initialImages={product?.images ?? []}
          name="images"
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Versions</h2>
        <VariantRowsEditor
          fallbackPrice={Number(product?.price ?? 0)}
          initialVariants={product?.variants ?? []}
          name="variants"
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Specifications</h2>
        <p className="text-sm text-neutral-600">
          Paste the full specs list at once, or edit rows one by one. They show
          in the schedule layout on the product page.
        </p>
        <SpecRowsEditor initialSpecs={initialSpecs} name="specifications" />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Features & about</h2>
        <Field label="Features" hint="One feature per line">
          <textarea
            className={textareaClassName}
            defaultValue={(product?.features ?? []).join("\n")}
            name="features"
          />
        </Field>
        <Field label="About title">
          <input
            className={inputClassName}
            defaultValue={product?.about?.title ?? ""}
            name="about_title"
          />
        </Field>
        <div className="grid gap-1.5 text-sm">
          <span className="font-medium text-neutral-800">About description</span>
          <RichTextField
            defaultValue={product?.about?.description ?? ""}
            name="about_description"
          />
          <span className="text-xs text-neutral-500">
            Paste your formatted text here. Bold text and paragraph breaks are
            kept. Use Bold for important points.
          </span>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <ReviewRowsEditor initialItems={product?.reviews ?? []} name="reviews" />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">FAQ</h2>
        <FaqRowsEditor initialItems={product?.faq ?? []} name="faq" />
      </section>

      <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">SEO</h2>
        <Field label="SEO title">
          <input
            className={inputClassName}
            defaultValue={product?.seo_title ?? ""}
            name="seo_title"
          />
        </Field>
        <Field label="SEO description">
          <textarea
            className={textareaClassName}
            defaultValue={product?.seo_description ?? ""}
            name="seo_description"
          />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          type="submit"
        >
          Save product
        </button>
        <Link
          className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-white"
          href="/admin/products"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <form action={deleteProductAction} className="mt-4">
      <input name="id" type="hidden" value={productId} />
      <button
        className="text-sm font-medium text-red-600 hover:underline"
        type="submit"
      >
        Delete product
      </button>
    </form>
  );
}
