import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request);
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/admin")) {
      return response;
    }

    if (pathname === "/admin/login") {
      return response;
    }

    if (!hasSupabasePublicEnv()) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
    const key = (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
    ).trim();
    const adminAllowlist = (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email?.trim().toLowerCase() ?? "";
    const isAdmin =
      Boolean(user) &&
      (adminAllowlist.includes(user!.id) ||
        (email.length > 0 &&
          adminAllowlist.some((entry) => entry.toLowerCase() === email)));

    if (!isAdmin) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch (error) {
    console.error("[middleware] Failed:", error);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
