"use server";

import { AUTH_PROVIDERS, AUTH_ROUTES } from "@/constants/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const getURL = () => {
  const isLocalEnv = process.env.NODE_ENV === "development";
  let url = isLocalEnv
    ? "http://localhost:3000/"
    : process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: AUTH_PROVIDERS.GOOGLE,
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${getURL()}${redirectTo || ""}`,
    },
  });

  if (error) {
    console.error("Authentication error:", error.message);
    return redirect(AUTH_ROUTES.ERROR);
  }

  return redirect(data.url);
}
