import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ArticleForm,
  DeleteArticleButton,
} from "@/components/admin/ArticleForm";
import { getAdminArticle } from "@/lib/admin/data";

type AdminEditBlogPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditBlogPage({
  params,
  searchParams,
}: AdminEditBlogPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const article = await getAdminArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <AdminShell title="Edit blog">
      {query.saved ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Article saved.
        </p>
      ) : null}
      <ArticleForm article={article} />
      <DeleteArticleButton articleId={article.id} />
    </AdminShell>
  );
}
