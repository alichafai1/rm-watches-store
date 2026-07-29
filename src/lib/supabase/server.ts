import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/** Public/anon client for general server reads. */
export function createServerSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Preferred for storefront CMS reads on Vercel.
 * Uses service role when available (server-only) so published products still
 * load even if the public key/RLS setup is incomplete.
 */
export function createCmsReadSupabaseClient() {
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (serviceRoleKey) {
    return createClient(getSupabaseUrl(), serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerSupabaseClient();
}
