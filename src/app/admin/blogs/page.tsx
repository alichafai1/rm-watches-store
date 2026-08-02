import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAdminArticles } from "@/lib/admin/data";

export default async function AdminBlogsPage() {
  let articles: Awaited<ReturnType<typeof listAdminArticles>> = [];
  let errorMessage: string | null = null;

  try {
    articles = await listAdminArticles();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load content.";
  }

  return (
    <AdminShell title="Blog & guides">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-600">
            Blogs publish to `/blog`; guides publish to `/guides`.
          </p>
          <Link
            className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white"
            href="/admin/blogs/new"
          >
            New article
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
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-neutral-500" colSpan={5}>
                    No articles or guides yet.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    className="border-b border-neutral-100 last:border-b-0"
                    key={article.id}
                  >
                    <td className="px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3 capitalize">{article.type}</td>
                    <td className="px-4 py-3 capitalize">{article.status}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(article.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="font-medium underline"
                        href={`/admin/blogs/${article.id}`}
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
