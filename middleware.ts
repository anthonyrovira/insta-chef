import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { AUTH_ROUTES } from "@/constants/auth";
import { validateConfig } from "@/config/supabase";

export async function middleware(req: NextRequest) {
  validateConfig();

  const session = await updateSession(req);
  const res = NextResponse.next();

  // Protected routes
  const protectedPaths = ["/favorites"];
  const isProtectedRoute = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (!session && isProtectedRoute) {
    const loginUrl = new URL(AUTH_ROUTES.LOGIN, req.url);
    loginUrl.searchParams.set("returnUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
