/* eslint-disable no-extend-native */
/**
 * Replaces Next.js's unconditional `polyfill-module`.
 * Modern evergreen browsers already ship the APIs Lighthouse flags
 * (Array.at, flat/flatMap, Object.fromEntries/hasOwn, trimStart/trimEnd).
 * Keep only URL.canParse — still missing in Chrome/Edge < 120 and Safari < 17,
 * within Next.js's supported browser range (Chrome 111+, Safari 16.4+).
 */
if (!("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      return !!new URL(url, base);
    } catch {
      return false;
    }
  };
}
