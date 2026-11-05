import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";
import { createLog } from "@/app/db-data/log";
import { delete_User_Session } from "@/app/db-data/user-session";

// Terminates one session of the logged-in user: the browser using it is sent to the
// login page on its next request.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  const pathname = '/user/[id]/session/[sessionId]';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own sessions: the user id comes from the session
  const userId = session.user.id;
  const { id: urlUserId, sessionId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const deleted = await delete_User_Session(userId, sessionId);
    if (!deleted) {
      return NextResponse.json(
        { error: `${pathname} DELETE route session not found` },
        { status: HttpStatus.NOT_FOUND }
      );
    }
    await createLog({
      id: 0,
      date_oper: new Date(),
      user_id: userId,
      severite: 'info',
      message: 'Session terminated by user',
      contexte: JSON.stringify({ sessionId }),
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
