import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminCollectionOptions } from "@/lib/admin/collections";

export default function AdminNewProductPage() {
  const collections = getAdminCollectionOptions();

  return (
    <AdminShell title="New product">
      <ProductForm collections={collections} />
    </AdminShell>
  );
}
