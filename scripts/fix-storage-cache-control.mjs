/**
 * Backfill Cache-Control on existing public website-media objects.
 *
 * Supabase serves Cache-Control from object metadata set at upload time.
 * Existing files keep a short TTL (or `no-cache`) until rewritten.
 * Public URLs / paths are unchanged.
 *
 * Usage: node --env-file=.env.local scripts/fix-storage-cache-control.mjs
 */
import { createClient } from "@supabase/supabase-js";

const BUCKET = "website-media";
/** Storage-js sets `Cache-Control: max-age=${value}`; do not prefix max-age=. */
const CACHE_CONTROL = "31536000, immutable";
const EXPECTED = "max-age=31536000, immutable";
const PAGE_SIZE = 100;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function listAllPaths(prefix = "") {
  const paths = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw error;
    if (!data?.length) break;

    for (const entry of data) {
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        paths.push(...(await listAllPaths(fullPath)));
      } else {
        paths.push(fullPath);
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return paths;
}

async function getCacheControl(path) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `${url}/storage/v1/object/info/authenticated/${BUCKET}/${encoded}`,
    {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json.cache_control ?? json.cacheControl ?? null;
}

async function rewriteCacheControl(path) {
  const current = await getCacheControl(path);
  if (current === EXPECTED || current === `public, ${EXPECTED}`) {
    return "skipped";
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(path);

  if (downloadError) {
    throw new Error(`download ${path}: ${downloadError.message}`);
  }

  const contentType = blob.type || "application/octet-stream";
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Prefer update() so S3 metadata is replaced on existing keys.
  const { error: updateError } = await supabase.storage
    .from(BUCKET)
    .update(path, buffer, {
      cacheControl: CACHE_CONTROL,
      contentType,
      upsert: true,
    });

  if (updateError) {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        cacheControl: CACHE_CONTROL,
        contentType,
        upsert: true,
      });
    if (uploadError) {
      throw new Error(
        `update/upload ${path}: ${updateError.message}; ${uploadError.message}`,
      );
    }
  }

  return "updated";
}

const paths = await listAllPaths();
console.log(`Found ${paths.length} objects in ${BUCKET}`);

let updated = 0;
let skipped = 0;
let failed = 0;

for (const path of paths) {
  try {
    const result = await rewriteCacheControl(path);
    if (result === "skipped") {
      skipped += 1;
      console.log(`· ${path}`);
    } else {
      updated += 1;
      console.log(`✓ ${path}`);
    }
  } catch (error) {
    failed += 1;
    console.error(`✗ ${path}:`, error.message ?? error);
  }
}

console.log(`Done. updated=${updated} skipped=${skipped} failed=${failed}`);

if (typeof supabase.storage.purgeBucketCache === "function") {
  const { error: purgeError } = await supabase.storage.purgeBucketCache(BUCKET);
  console.log(
    "CDN bucket purge:",
    purgeError ? purgeError.message : "queued (Pro+)",
  );
} else {
  // REST fallback (Pro plan). Ignore failures on free tier.
  const purge = await fetch(`${url}/storage/v1/cdn/${BUCKET}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });
  console.log(
    "CDN bucket purge:",
    purge.ok ? "queued" : `${purge.status} ${(await purge.text()).slice(0, 120)}`,
  );
}

const samples = [
  "Richard Mille Replica.webp",
  "1.webp",
  "richard-mille-rm-035-rafael-nadal-replica.webp",
].filter((sample) => paths.includes(sample));

for (const sample of samples) {
  const encoded = sample.split("/").map(encodeURIComponent).join("/");
  const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${encoded}?v=${Date.now()}`;
  const response = await fetch(publicUrl);
  console.log(
    "verify",
    sample,
    "->",
    response.headers.get("cache-control"),
    response.headers.get("cf-cache-status"),
  );
}

if (failed > 0) process.exit(1);
