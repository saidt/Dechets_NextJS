import { NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { checkSession } from "@/lib/auth-lib";

// Session check for idle pages (SessionWatcher): the same checks as every API call
// (Session row, expiry, browser and IP). Returns the session's end; an ended session
// gets { error: <reason> } with 401 (proxy.ts usually redirects to the login page first).
export async function GET() {
  const pathname = '/session-check';
  try {
    const { session, error } = await checkSession();
    if (!session) {
      return NextResponse.json({ error }, { status: HttpStatus.UNAUTHORIZED });
    }
    return NextResponse.json({ expiresAt: session.expiresAt });
  }
  catch (err: unknown) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
