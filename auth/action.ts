"use server";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { AUTH_PROVIDERS, AUTH_ROUTES } from "@/constants/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: AUTH_PROVIDERS.GOOGLE,
    options: {
      redirectTo: `${SUPABASE_CONFIG.url}${AUTH_ROUTES.CALLBACK}`,
    },
  });

  if (error) {
    console.error("Authentication error:", error.message);
    return redirect(AUTH_ROUTES.ERROR);
  }

  return redirect(data.url);
}
