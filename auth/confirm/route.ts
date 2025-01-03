import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/constants/auth";

export async function GET(request: NextRequest) {
  // get the search params from the request
  const { searchParams } = new URL(request.url);
  // get the token_hash and type from the request
  const token_hash = searchParams.get("token_hash");
  // get the type from the request
  const type = searchParams.get("type") as EmailOtpType | null;
  // get the next url from the request
  const next = searchParams.get("next") ?? AUTH_ROUTES.HOME;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(AUTH_ROUTES.ERROR);
}
