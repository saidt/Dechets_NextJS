import { NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { checkRole, getValidSession } from "@/lib/auth-lib";
import { list_All_Sessions } from "@/app/db-data/user-session";
import { SESSION_ADMIN_ROLE } from "@/types/admin-session";

// Active sessions of all users (admin "Sessions actives" page)
export async function GET() {
  const pathname = '/session';
  if (! await checkRole(SESSION_ADMIN_ROLE)) {
    const err = new Error(`Forbidden: ${SESSION_ADMIN_ROLE}`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const session = await getValidSession();
    const data = await list_All_Sessions(session?.sessionUuid ?? '');
    return NextResponse.json({ data });
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
