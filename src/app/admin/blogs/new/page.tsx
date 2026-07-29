import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default function AdminNewBlogPage() {
  return (
    <AdminShell title="New blog">
      <ArticleForm />
    </AdminShell>
  );
}
