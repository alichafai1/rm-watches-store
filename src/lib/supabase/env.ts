function cleanEnv(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim();
}

function required(name: string, value: string | undefined) {
  const cleaned = cleanEnv(value);
  if (!cleaned) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return cleaned;
}

export function getSupabaseUrl() {
  let url = required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );

  // Common Vercel paste mistakes: quotes, missing protocol, trailing slash.
  url = url.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    // Throws if still invalid.
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL. Use your project URL like https://xxxx.supabase.co (no quotes). Current value length: ${url.length}`,
    );
  }

  return url;
}

/** Browser/public key — supports both new publishable and classic anon names. */
export function getSupabasePublishableKey() {
  return required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseServiceRoleKey() {
  return cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) || null;
}

export function hasSupabasePublicEnv() {
  return Boolean(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
        cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)),
  );
}
