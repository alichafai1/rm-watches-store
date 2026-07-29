import type { User } from "@supabase/supabase-js";
import { createServerSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

function getAdminUserIds() {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function isAdminUser(user: User | null | undefined) {
  if (!user) {
    return false;
  }

  return getAdminUserIds().includes(user.id);
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
