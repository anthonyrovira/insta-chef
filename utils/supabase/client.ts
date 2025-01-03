import { SUPABASE_CONFIG } from "@/config/supabase";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(SUPABASE_CONFIG.url as string, SUPABASE_CONFIG.anonKey as string);
}
