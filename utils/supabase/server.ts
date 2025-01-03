import { SUPABASE_CONFIG } from "@/config/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_CONFIG.url as string, SUPABASE_CONFIG.anonKey as string, {
    cookies: {
      // get all cookies
      getAll() {
        return cookieStore.getAll();
      },
      // set all cookies
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
