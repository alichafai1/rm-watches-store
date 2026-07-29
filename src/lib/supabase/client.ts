import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

export const supabaseBrowserClient = createClient(
  getSupabaseUrl(),
  getSupabasePublishableKey(),
);
