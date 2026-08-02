import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCounts } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  let counts = {
    productsTotal: 0,
    productsDraft: 0,
    productsPublished: 0,
    articlesTotal: 0,
    articlesDraft: 0,
    articlesPublished: 0,
  };
  let errorMessage: string | null = null;

  try {
    counts = await getAdminCounts();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Could not load dashboard counts.";
  }

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-6">
        {errorMessage ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium">Database not ready</p>
            <p className="mt-1">
              Run <code>supabase/admin-schema.sql</code> in the Supabase SQL
              Editor, then refresh. ({errorMessage})
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="mt-2 text-3xl font-semibold">{counts.productsTotal}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {counts.productsPublished} published · {counts.productsDraft} draft
            </p>
            <div className="mt-4 flex gap-3 text-sm font-medium">
              <Link className="text-neutral-950 underline" href="/admin/products">
                View all
              </Link>
              <Link
                className="text-neutral-950 underline"
                href="/admin/products/new"
              >
                New product
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Blog & guides</h2>
            <p className="mt-2 text-3xl font-semibold">{counts.articlesTotal}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {counts.articlesPublished} published · {counts.articlesDraft} draft
            </p>
            <div className="mt-4 flex gap-3 text-sm font-medium">
              <Link className="text-neutral-950 underline" href="/admin/blogs">
                View all
              </Link>
              <Link className="text-neutral-950 underline" href="/admin/blogs/new">
                New article
              </Link>
            </div>
          </article>
        </div>
      </div>
    </AdminShell>
  );
}
