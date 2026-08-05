/**
 * Turns the supplied logo artwork into the asset the header and footer render.
 *
 * The source arrives as a wide canvas with the mark floating in a large white
 * margin. Rendering that directly would make the logo look tiny and off-centre,
 * because most of the box is empty. This trims to the artwork and drops the white
 * backdrop so the mark sits flush against whatever background it is placed on.
 *
 * Usage: npx tsx scripts/build-logo.mts <source-image>
 */

import sharp from "sharp";

const SOURCE = process.argv[2];
const OUTPUT = "public/images/brand/logo.png";

/** Pixels at or above this stay fully transparent; the backdrop is pure white. */
const TRANSPARENT_AT = 250;
/** Below this stays fully opaque, which keeps anti-aliased edges from fringing. */
const OPAQUE_BELOW = 236;

if (!SOURCE) {
  console.error("Pass the source image path as the first argument.");
  process.exit(1);
}

const trimmed = await sharp(SOURCE)
  .trim({ threshold: 10 })
  .toBuffer({ resolveWithObject: true });

const { data, info } = await sharp(trimmed.data)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += info.channels) {
  const lightest = Math.min(data[i], data[i + 1], data[i + 2]);

  if (lightest >= TRANSPARENT_AT) {
    data[i + 3] = 0;
  } else if (lightest > OPAQUE_BELOW) {
    const span = TRANSPARENT_AT - OPAQUE_BELOW;
    data[i + 3] = Math.round(((TRANSPARENT_AT - lightest) / span) * 255);
  }
}

const output = await sharp(data, {
  raw: { channels: 4, height: info.height, width: info.width },
})
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(output).toFile(OUTPUT);

const final = await sharp(OUTPUT).metadata();
console.log(
  `${OUTPUT} -> ${final.width}x${final.height} (aspect ${(
    final.width! / final.height!
  ).toFixed(3)}), ${(output.length / 1024).toFixed(1)} KB`,
);
