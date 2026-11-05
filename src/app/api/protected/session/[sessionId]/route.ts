import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { checkRole, getValidSession } from "@/lib/auth-lib";
import { createLog } from "@/app/db-data/log";
import { delete_Session } from "@/app/db-data/user-session";
import { SESSION_ADMIN_ROLE } from "@/types/admin-session";

// Terminates any user's session (admin): the browser using it is sent to the login
// page on its next request.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const pathname = '/session/[sessionId]';
  if (! await checkRole(SESSION_ADMIN_ROLE)) {
    const err = new Error(`Forbidden: ${SESSION_ADMIN_ROLE}`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const { sessionId } = await params;
    const sessionUserId = await delete_Session(sessionId);
    if (!sessionUserId) {
      return NextResponse.json(
        { error: `${pathname} DELETE route session not found` },
        { status: HttpStatus.NOT_FOUND }
      );
    }
    const admin = await getValidSession();
    await createLog({
      id: 0,
      date_oper: new Date(),
      user_id: sessionUserId,
      severite: 'warn',
      message: 'Session terminated by admin',
      contexte: JSON.stringify({ sessionId, admin: admin?.user?.id ?? null }),
    }).catch(() => undefined);
    return NextResponse.json({ deleted: true });
  }
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
