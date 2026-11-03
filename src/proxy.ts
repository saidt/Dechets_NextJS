import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "./lib/auth";
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
    const session = await getServerSession(authOptions);

    var message = '';
    if (! session) {
      message='SessionNotFound'
    }
    else {
      const sessionUuid = session.sessionUuid
      //consoleInfo('proxy sessionUuid : ', sessionUuid);
      if (!sessionUuid) {
        message='SessionUiidNotFound'
      }
      else {
        const response  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uuid: sessionUuid
          }),
        });

        if (!response.ok) {
          message='WrongResponse'
        }
        else {
          const data = await response.json();
          //consoleInfo('proxy data : ', JSON.stringify(data));

          const dbSession = data.data
          //consoleInfo('proxy dbSession : ', JSON.stringify(dbSession));
          if (!dbSession) {
            message='DbSessionNotFound'
          }
          else {
            const expires = new Date(dbSession.expires)
            //consoleInfo('proxy dbSession.expires : ', expires);
            const now = new Date()
            if (expires < now) {
              message='SessionExpired'
            }
          }
        }
      }
    }

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