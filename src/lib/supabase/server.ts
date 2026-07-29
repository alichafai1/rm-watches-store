import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

const CMS_FETCH_TIMEOUT_MS = 2500;

function timedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_FETCH_TIMEOUT_MS);

  const upstream = init?.signal;
  if (upstream) {
    if (upstream.aborted) {
      controller.abort();
    } else {
      upstream.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeout);
  });
}

/** Public/anon client for general server reads. */
export function createServerSupabaseClient() {
  return createTimedClient(getSupabaseUrl(), getSupabasePublishableKey());
}

function createTimedClient(url: string, key: string) {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: timedFetch,
    },
  });
}

/**
 * Preferred for storefront CMS reads on Vercel.
 * Uses service role when available (server-only) so published products still
 * load even if the public key/RLS setup is incomplete.
 */
export function createCmsReadSupabaseClient() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (serviceRoleKey) {
    return createTimedClient(url, serviceRoleKey);
  }

  return createServerSupabaseClient();
}

/** Candidates for CMS reads: service role first, then publishable/anon. */
export function createCmsReadSupabaseClients() {
  const url = getSupabaseUrl();
  const clients = [];
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (serviceRoleKey) {
    clients.push(createTimedClient(url, serviceRoleKey));
  }

  try {
    clients.push(createTimedClient(url, getSupabasePublishableKey()));
  } catch {
    // Publishable key missing — service role alone may still work.
  }

  return clients;
}
