import { NextResponse } from "next/server";
import {
  catalogToCsv,
  catalogToJson,
  toCatalogRow,
} from "@/lib/admin/catalog-export";
import { requireAdminDb } from "@/lib/auth/admin";
import type { CmsProductRecord } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdminDb();
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") ?? "json").toLowerCase();
    const publishedOnly = searchParams.get("published") === "1";

    let query = supabase
      .from("cms_products")
      .select("*")
      .order("updated_at", { ascending: false });

    if (publishedOnly) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = ((data ?? []) as CmsProductRecord[]).map(toCatalogRow);
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      return new NextResponse(catalogToCsv(rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="product-catalog-${stamp}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return new NextResponse(catalogToJson(rows), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="product-catalog-${stamp}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
