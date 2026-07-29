import { NextResponse } from "next/server";
import { createCmsReadSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const hasPublishableKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const hasAdminIds = Boolean(process.env.ADMIN_USER_IDS?.trim());

  try {
    const supabase = createCmsReadSupabaseClient();
    const { data, error } = await supabase
      .from("cms_products")
      .select("id, title, slug, status")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      ok: !error,
      env: {
        hasUrl,
        hasPublishableKey,
        hasAnonKey,
        hasServiceRole,
        hasAdminIds,
      },
      error: error?.message ?? null,
      publishedCount: data?.length ?? 0,
      products:
        data?.map((row) => ({
          title: row.title,
          slug: row.slug,
          status: row.status,
        })) ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        env: {
          hasUrl,
          hasPublishableKey,
          hasAnonKey,
          hasServiceRole,
          hasAdminIds,
        },
        error: error instanceof Error ? error.message : "Unknown error",
        publishedCount: 0,
        products: [],
      },
      { status: 500 },
    );
  }
}
