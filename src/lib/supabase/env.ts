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

/** True when the value looks like a real Supabase project URL (not a typo like "public123"). */
export function isLikelySupabaseProjectUrl(raw: string | undefined) {
  const cleaned = cleanEnv(raw);
  if (!cleaned) {
    return false;
  }

  const withProtocol = /^https?:\/\//i.test(cleaned)
    ? cleaned
    : `https://${cleaned}`;

  try {
    const host = new URL(withProtocol.replace(/\/+$/, "")).hostname.toLowerCase();
    return host.endsWith(".supabase.co") || host === "supabase.co";
  } catch {
    return false;
  }
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

  if (!isLikelySupabaseProjectUrl(url)) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must be your Supabase project URL (https://xxxx.supabase.co). Got host that is not *.supabase.co (length ${url.length}).`,
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
    isLikelySupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
        cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)),
  );
}

/** Storefront CMS reads only when URL + at least one usable key look configured. */
export function hasUsableCmsEnv() {
  return (
    isLikelySupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(
      cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
        cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
        cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    )
  );
}
