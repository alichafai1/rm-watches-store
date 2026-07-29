import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  DeleteProductButton,
  ProductForm,
} from "@/components/admin/ProductForm";
import { getAdminCollectionOptions } from "@/lib/admin/collections";
import { getAdminProduct } from "@/lib/admin/data";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditProductPage({
  params,
  searchParams,
}: AdminEditProductPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const product = await getAdminProduct(id);
  const collections = getAdminCollectionOptions();

  if (!product) {
    notFound();
  }

  return (
    <AdminShell title="Edit product">
      {query.saved ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Product saved.
        </p>
      ) : null}
      <ProductForm collections={collections} product={product} />
      <DeleteProductButton productId={product.id} />
    </AdminShell>
  );
}
