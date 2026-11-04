import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/auth-lib";
import { consoleInfo } from "@/lib/clientLog";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/protected") || pathname.startsWith("/api/protected")) {
    // Same check as the API routes: JWT session + its row in the Session table
    const { error } = await checkSession();
    const message = error ?? '';

    if ( message != '') {
      consoleInfo('proxy message : ', message)

      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", message); 
      const res = NextResponse.redirect(url)

      // Remove NextAuth cookies
      res.cookies.set("next-auth.session-token", "", { maxAge: 0 })
      res.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 })
      res.cookies.set("next-auth.csrf-token", "", { maxAge: 0 })

      return res;
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/protected/:path*",   // protect pages
    "/api/protected/:path*" // protect API routes
  ],
};