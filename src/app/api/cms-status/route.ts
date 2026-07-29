import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasUsableCmsEnv,
  isLikelySupabaseProjectUrl,
} from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

function clean(raw: string | undefined) {
  return (raw ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim();
}

function inspectUrl(raw: string | undefined) {
  const value = clean(raw);

  if (!value) {
    return {
      present: false,
      length: 0,
      looksLikeSupabase: false,
      startsWithHttp: false,
      preview: null as string | null,
    };
  }

  const startsWithHttp = /^https?:\/\//i.test(value);
  const normalized = startsWithHttp ? value : `https://${value}`;
  let host = "";
  try {
    host = new URL(normalized.replace(/\/+$/, "")).host;
  } catch {
    host = "";
  }

  return {
    present: true,
    length: value.length,
    looksLikeSupabase: isLikelySupabaseProjectUrl(value),
    startsWithHttp,
    preview: host || value.slice(0, 24),
  };
}

/** Safe fingerprint — never returns the full secret. */
function inspectKey(raw: string | undefined) {
  const value = clean(raw);
  if (!value) {
    return { present: false, length: 0, prefix: null as string | null };
  }

  return {
    present: true,
    length: value.length,
    prefix: value.slice(0, 12),
  };
}

async function probeKey(label: string, key: string | null) {
  if (!key) {
    return { label, ok: false, error: "missing", count: 0 };
  }

  try {
    const supabase = createClient(getSupabaseUrl(), key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("cms_products")
      .select("id, title, slug, status")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10);

    return {
      label,
      ok: !error,
      error: error?.message ?? null,
      count: data?.length ?? 0,
      products:
        data?.map((row) => ({
          title: row.title,
          slug: row.slug,
          status: row.status,
        })) ?? [],
    };
  } catch (error) {
    return {
      label,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
      count: 0,
      products: [],
    };
  }
}

export async function GET() {
  const urlInfo = inspectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableInfo = inspectKey(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const serviceRoleInfo = inspectKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasAdminIds = Boolean(clean(process.env.ADMIN_USER_IDS));

  let fixHint: string | null = null;
  if (!urlInfo.looksLikeSupabase) {
    fixHint =
      "Set NEXT_PUBLIC_SUPABASE_URL on Vercel to https://YOUR_PROJECT.supabase.co, then Redeploy.";
  }

  if (!hasUsableCmsEnv()) {
    return NextResponse.json(
      {
        ok: false,
        env: {
          url: urlInfo,
          publishableKey: publishableInfo,
          serviceRoleKey: serviceRoleInfo,
          hasAdminIds,
        },
        error: "Supabase env is not usable for CMS reads.",
        fixHint,
        publishedCount: 0,
        products: [],
      },
      { status: 500 },
    );
  }

  const serviceRole = getSupabaseServiceRoleKey();
  let publishable: string | null = null;
  try {
    publishable = getSupabasePublishableKey();
  } catch {
    publishable = null;
  }

  const probes = await Promise.all([
    probeKey("service_role", serviceRole),
    probeKey("publishable", publishable),
  ]);

  const working = probes.find((probe) => probe.ok);

  if (!working) {
    fixHint =
      "URL is OK, but API keys are invalid for this Supabase project. In Vercel, replace SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY with keys from Supabase → Project Settings → API (same project as the URL). Then Redeploy.";
  }

  return NextResponse.json({
    ok: Boolean(working),
    env: {
      url: urlInfo,
      publishableKey: publishableInfo,
      serviceRoleKey: serviceRoleInfo,
      hasAdminIds,
    },
    probes: probes.map(({ label, ok, error, count }) => ({
      label,
      ok,
      error,
      count,
    })),
    error: working ? null : probes.map((p) => `${p.label}: ${p.error}`).join(" | "),
    fixHint,
    publishedCount: working?.count ?? 0,
    products: working?.products ?? [],
  });
}
