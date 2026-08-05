/**
 * Backfills the main gallery photo of existing products through the same
 * normalization the admin save now applies, so every storefront card frames its
 * watch the same. Additional photos keep their original framing.
 *
 * Normalized copies are uploaded under a new storage path and the product row is
 * repointed at them. Originals are left untouched, so a bad run can be reverted.
 *
 * Usage:
 *   node --env-file=.env.local scripts/normalize-product-images.mts --dry-run
 *   node --env-file=.env.local scripts/normalize-product-images.mts
 *
 * Flags:
 *   --dry-run       report what would change without writing anything
 *   --limit=<n>     only process the first n products
 *   --slug=<slug>   only process a single product
 *   --concurrency=n products processed in parallel (default 4)
 *   --report        list which images are already normalized and exit
 *   --audit         download every main image and report how each one is framed,
 *                   flagging any that is not square, then exit
 *   --ratio=<0-1>   how much of the frame the watch fills (default 0.94). Photos
 *                   with the strap cropped off look oversized at the default, so
 *                   they are re-framed nearer the catalogue median of ~0.65
 *   --force         re-normalize main images that were already processed, which is
 *                   needed after changing the framing ratio
 */

import { createClient } from "@supabase/supabase-js";
import { normalizeProductImage } from "../src/lib/images/product-image.ts";

const BUCKET = "website-media";
const NORMALIZED_PREFIX = "products/normalized/";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const reportOnly = args.includes("--report");
const auditOnly = args.includes("--audit");
const force = args.includes("--force");
const limitArg = args.find((value) => value.startsWith("--limit="));
const slugArg = args.find((value) => value.startsWith("--slug="));
const concurrencyArg = args.find((value) =>
  value.startsWith("--concurrency="),
);
const ratioArg = args.find((value) => value.startsWith("--ratio="));
const contentRatio = ratioArg ? Number(ratioArg.split("=")[1]) : undefined;

if (ratioArg && !(contentRatio! > 0 && contentRatio! <= 1)) {
  console.error(`--ratio must be between 0 and 1, got "${ratioArg.split("=")[1]}"`);
  process.exit(1);
}
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
const onlySlug = slugArg ? slugArg.split("=")[1] : undefined;
const concurrency = concurrencyArg
  ? Math.max(1, Number(concurrencyArg.split("=")[1]))
  : 4;

const contentTypeByExtension: Record<string, string> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

function contentTypeFor(imageUrl: string, headerValue: string | null) {
  const header = (headerValue ?? "").split(";")[0].trim().toLowerCase();
  if (supportedTypes.includes(header)) return header;

  const extension =
    new URL(imageUrl).pathname.split(".").pop()?.toLowerCase() ?? "";
  return contentTypeByExtension[extension] ?? null;
}

function extensionFor(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

/** How much of the frame the watch fills, used to report the before/after effect. */
async function measureFill(buffer: Buffer) {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(buffer).metadata();
  try {
    const trimmed = await sharp(buffer)
      .trim({ threshold: 12 })
      .toBuffer({ resolveWithObject: true });
    const frame = Math.max(meta.width ?? 0, meta.height ?? 0);
    const subject = Math.max(trimmed.info.width, trimmed.info.height);
    return frame ? subject / frame : 1;
  } catch {
    return 1;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with --env-file=.env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let query = supabase
  .from("cms_products")
  .select("id, slug, images")
  .order("created_at", { ascending: true });

if (onlySlug) query = query.eq("slug", onlySlug);
if (limit) query = query.limit(limit);

const { data: products, error } = await query;

if (error || !products) {
  console.error("Could not load products:", error?.message);
  process.exit(1);
}

if (reportOnly) {
  let mainNormalized = 0;
  let extraNormalized = 0;
  let untouched = 0;

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    const normalizedFlags = images.map((image) =>
      typeof image?.url === "string" && image.url.includes(NORMALIZED_PREFIX),
    );

    if (!normalizedFlags.some(Boolean)) {
      untouched += 1;
      continue;
    }

    if (normalizedFlags[0]) mainNormalized += 1;
    const extras = normalizedFlags.slice(1).filter(Boolean).length;
    extraNormalized += extras;
    console.log(
      `  ${product.slug}: main=${normalizedFlags[0] ? "normalized" : "original"} extras normalized=${extras}/${Math.max(0, images.length - 1)}`,
    );
  }

  console.log(`
Report over ${products.length} product(s):
  products with normalized main image: ${mainNormalized}
  secondary images normalized:         ${extraNormalized}
  products fully untouched:            ${untouched}
`);
  process.exit(0);
}

if (auditOnly) {
  // A card only looks consistent when the canvas is square and the watch fills the
  // same share of it, so check the pixels rather than trusting the storage path.
  const offenders: string[] = [];

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    const url = typeof images[0]?.url === "string" ? images[0].url : "";
    if (!url.startsWith("http")) continue;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`download failed (${response.status})`);

      const buffer = Buffer.from(await response.arrayBuffer());
      const sharp = (await import("sharp")).default;
      const meta = await sharp(buffer).metadata();
      const square = meta.width === meta.height;
      const fill = await measureFill(buffer);

      if (!square || fill < 0.9) {
        offenders.push(
          `  ${product.slug}\n    ${meta.width}x${meta.height}${square ? "" : " NOT SQUARE"} fill=${(fill * 100).toFixed(0)}%`,
        );
      }
    } catch (auditError) {
      offenders.push(
        `  ${product.slug}\n    could not read (${auditError instanceof Error ? auditError.message : auditError})`,
      );
    }
  }

  if (offenders.length) {
    console.log(`Main images framed differently to the rest:\n${offenders.join("\n")}`);
    console.log(`\nRe-frame each with: --force --slug=<slug>`);
  } else {
    console.log(`All ${products.length} main image(s) are square and evenly framed.`);
  }

  process.exit(offenders.length ? 1 : 0);
}

console.log(
  `${dryRun ? "[dry run] " : ""}Processing ${products.length} product(s)\n`,
);

let changedProducts = 0;
let changedImages = 0;
let skipped = 0;
let failed = 0;
const fillBefore: number[] = [];
const fillAfter: number[] = [];

async function processProduct(product: (typeof products)[number]) {
  const images = Array.isArray(product.images) ? product.images : [];
  if (!images.length) return;

  const nextImages: unknown[] = [];
  let productChanged = false;

  for (const [index, image] of images.entries()) {
    const imageUrl = typeof image?.url === "string" ? image.url : "";

    // Only the main image drives the storefront card, so the rest stay untouched.
    // Re-trimming an already normalized image strips the padding we added before
    // re-padding it, so --force can safely reframe at a new ratio.
    if (
      index > 0 ||
      !imageUrl.startsWith("http") ||
      (imageUrl.includes(NORMALIZED_PREFIX) && !force)
    ) {
      nextImages.push(image);
      skipped += 1;
      continue;
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`download failed (${response.status})`);
      }

      const contentType = contentTypeFor(
        imageUrl,
        response.headers.get("content-type"),
      );

      if (!contentType) {
        nextImages.push(image);
        skipped += 1;
        continue;
      }

      const original = Buffer.from(await response.arrayBuffer());
      const normalized = await normalizeProductImage(original, contentType, {
        contentRatio,
      });

      if (!normalized) {
        nextImages.push(image);
        skipped += 1;
        continue;
      }

      fillBefore.push(await measureFill(original));
      fillAfter.push(await measureFill(normalized.buffer));

      if (dryRun) {
        nextImages.push(image);
        changedImages += 1;
        productChanged = true;
        continue;
      }

      const path = `${NORMALIZED_PREFIX}${Date.now()}-${crypto.randomUUID()}.${extensionFor(contentType)}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, normalized.buffer, { contentType, upsert: false });

      if (uploadError) {
        throw new Error(`upload failed (${uploadError.message})`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

      nextImages.push({
        ...image,
        height: normalized.height,
        url: publicUrl,
        width: normalized.width,
      });
      changedImages += 1;
      productChanged = true;
    } catch (imageError) {
      console.warn(
        `  ! ${product.slug}: ${imageError instanceof Error ? imageError.message : imageError}`,
      );
      nextImages.push(image);
      failed += 1;
    }
  }

  if (!productChanged) return;

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from("cms_products")
      .update({ images: nextImages })
      .eq("id", product.id);

    if (updateError) {
      console.error(
        `  ! ${product.slug}: update failed (${updateError.message})`,
      );
      failed += 1;
      return;
    }
  }

  changedProducts += 1;
  console.log(`  ${dryRun ? "would update" : "updated"} ${product.slug}`);
}

const queue = [...products];
await Promise.all(
  Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const product = queue.shift();
      if (product) await processProduct(product);
    }
  }),
);

function range(values: number[]) {
  if (!values.length) return "n/a";
  return `${(Math.min(...values) * 100).toFixed(0)}%-${(Math.max(...values) * 100).toFixed(0)}%`;
}

console.log(`
${dryRun ? "[dry run] " : ""}Done.
  products changed:  ${changedProducts}
  images changed:    ${changedImages}
  skipped:           ${skipped}
  failed:            ${failed}
  frame fill before: ${range(fillBefore)}
  frame fill after:  ${range(fillAfter)}
`);
