import type { User } from "@supabase/supabase-js";
import { createServerSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

function getAdminAllowlist() {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function isAdminUser(user: User | null | undefined) {
  if (!user) {
    return false;
  }

  const allowlist = getAdminAllowlist();
  if (allowlist.includes(user.id)) {
    return true;
  }

  const email = user.email?.trim().toLowerCase();
  if (!email) {
    return false;
  }

  // Allow email entries in ADMIN_USER_IDS as a fallback when the UUID is missing/wrong.
  return allowlist.some((entry) => entry.toLowerCase() === email);
}

export async function getAdminSession() {
  const supabase = await createServerSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    return { supabase, user: null, isAdmin: false as const };
  }

  return { supabase, user, isAdmin: true as const };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.isAdmin || !session.user) {
    throw new Error("Unauthorized");
  }

  return {
    supabase: session.supabase,
    user: session.user,
  };
}

/** Auth check + service-role DB client (bypasses RLS after verifying admin). */
export async function requireAdminDb() {
  const { user } = await requireAdmin();
  return {
    user,
    supabase: createServiceRoleSupabaseClient(),
  };
}
