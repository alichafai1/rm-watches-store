/**
 * Supabase Storage `cacheControl` value for public website images.
 *
 * Storage-js sets `Cache-Control: max-age=${cacheControl}` on upload, so pass
 * seconds (and optional directives) — not a full `max-age=...` string.
 *
 * Admin uploads use unique paths (`admin/<timestamp>-<uuid>.ext`), so a long
 * TTL is safe: replacing an image creates a new URL rather than mutating one.
 */
export const WEBSITE_MEDIA_CACHE_CONTROL = "31536000, immutable";
