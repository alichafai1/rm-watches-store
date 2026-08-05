/**
 * Product photos arrive with wildly different framing: some are tightly cropped
 * around the watch, others sit inside a large transparent or white margin. The
 * storefront cards render every photo in the same square frame, so that baked-in
 * margin is what makes one watch look small and the next one oversized.
 *
 * Normalizing trims the surrounding margin, then re-pads the watch onto a square
 * canvas so it always occupies the same share of the frame. The watch itself is
 * never resampled unless the canvas exceeds MAX_CANVAS, so quality is preserved.
 *
 * Only the main gallery image is normalized, since that is the one the storefront
 * cards render. Additional angles and detail shots keep their original framing.
 */

/** Storage folder for normalized copies; also marks an image as already processed. */
export const NORMALIZED_IMAGE_PREFIX = "products/normalized/";

/**
 * Share of the square canvas the watch occupies once normalized. Kept high so the
 * watch still reads clearly in the small cards used on phones, while leaving just
 * enough margin that it never looks cropped against the frame edge.
 *
 * This measures the watch's longest side, which works because almost every photo
 * shows the full watch standing upright, so the strap sets the height and the case
 * reads at a consistent width. A photo whose strap is cropped at the edges has a
 * much squarer outline, and filling the frame with it makes the case tower over the
 * neighbouring cards; those are re-framed at a smaller ratio instead.
 */
const CONTENT_RATIO = 0.94;
/** Largest square we store; bigger canvases are downscaled to this. */
const MAX_CANVAS = 1600;
/** How far a border pixel may drift from the reference colour and still count as margin. */
const TRIM_THRESHOLD = 12;

export const NORMALIZABLE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type NormalizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
};

/**
 * Trims the uniform margin around the subject and centres it on a square canvas.
 * Returns `null` when the image cannot be normalized safely, so callers can fall
 * back to storing the original untouched.
 */
export async function normalizeProductImage(
  input: Buffer,
  contentType: string,
  options?: {
    /** Overrides how much of the frame the watch fills. See CONTENT_RATIO. */
    contentRatio?: number;
  },
): Promise<NormalizedImage | null> {
  if (!NORMALIZABLE_IMAGE_TYPES.includes(contentType)) return null;

  const contentRatio = options?.contentRatio ?? CONTENT_RATIO;
  if (!(contentRatio > 0 && contentRatio <= 1)) return null;

  const sharp = (await import("sharp")).default;

  // rotate() applies EXIF orientation, otherwise a portrait phone photo would be
  // padded along the wrong axis.
  const oriented = await sharp(input, { animated: false })
    .rotate()
    .toBuffer({ resolveWithObject: true });

  const hasAlpha = Boolean(oriented.info.channels === 4);
  const background = hasAlpha
    ? { r: 0, g: 0, b: 0, alpha: 0 }
    : { r: 255, g: 255, b: 255, alpha: 1 };

  let content: { data: Buffer; info: { width: number; height: number } };
  try {
    content = await sharp(oriented.data)
      .trim({ threshold: TRIM_THRESHOLD })
      .toBuffer({ resolveWithObject: true });
  } catch {
    // A blank or fully uniform image has nothing to trim; keep it as-is.
    content = {
      data: oriented.data,
      info: { width: oriented.info.width, height: oriented.info.height },
    };
  }

  const { width, height } = content.info;
  if (!width || !height) return null;

  // Sizing the canvas around the trimmed subject keeps the watch at its native
  // resolution instead of upscaling small photos.
  const side = Math.ceil(Math.max(width, height) / contentRatio);
  const left = Math.floor((side - width) / 2);
  const top = Math.floor((side - height) / 2);

  let pipeline = sharp(content.data).extend({
    background,
    bottom: side - height - top,
    left,
    right: side - width - left,
    top,
  });

  if (side > MAX_CANVAS) {
    pipeline = pipeline.resize(MAX_CANVAS, MAX_CANVAS, { fit: "fill" });
  }

  const output = await encode(pipeline, contentType, hasAlpha);

  return {
    buffer: output.data,
    height: output.info.height,
    width: output.info.width,
  };
}

function encode(
  pipeline: import("sharp").Sharp,
  contentType: string,
  hasAlpha: boolean,
) {
  if (contentType === "image/png") {
    return pipeline.png({ compressionLevel: 9 }).toBuffer({
      resolveWithObject: true,
    });
  }

  if (contentType === "image/webp") {
    return pipeline
      .webp({ alphaQuality: 100, quality: 90 })
      .toBuffer({ resolveWithObject: true });
  }

  // JPEG has no alpha channel, so flatten onto white rather than black.
  return (hasAlpha ? pipeline.flatten({ background: "#ffffff" }) : pipeline)
    .jpeg({ mozjpeg: true, quality: 90 })
    .toBuffer({ resolveWithObject: true });
}
