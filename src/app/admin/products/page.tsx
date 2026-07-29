import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAdminProducts } from "@/lib/admin/data";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let errorMessage: string | null = null;

  try {
    products = await listAdminProducts();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load products.";
  }

  return (
    <AdminShell title="Products">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-600">
            Create drafts, then publish when ready.
          </p>
          <Link
            className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white"
            href="/admin/products/new"
          >
            New product
          </Link>
        </div>

        {errorMessage ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {errorMessage}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-neutral-500" colSpan={4}>
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    className="border-b border-neutral-100 last:border-b-0"
                    key={product.id}
                  >
                    <td className="px-4 py-3 font-medium">{product.title}</td>
                    <td className="px-4 py-3 capitalize">{product.status}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="font-medium underline"
                        href={`/admin/products/${product.id}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
