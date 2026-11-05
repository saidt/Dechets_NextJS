import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";
import { delete_Other_User_Sessions, list_User_Sessions } from "@/app/db-data/user-session";
import { createLog } from "@/app/db-data/log";

// Active sessions of the logged-in user (profile page)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/session';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own sessions: the user id comes from the session
  const userId = session.user.id;
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const data = await list_User_Sessions(userId, session.sessionUuid);
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

// Log out everywhere else: terminates all the logged-in user's sessions except the
// one making this request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/session';
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
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const deleted = await delete_Other_User_Sessions(userId, session.sessionUuid);
    if (deleted > 0) {
      await createLog({
        id: 0,
        date_oper: new Date(),
        user_id: userId,
        severite: 'info',
        message: 'Other sessions terminated by user',
        contexte: JSON.stringify({ deleted }),
      }).catch(() => undefined);
    }
    return NextResponse.json({ deleted });
  }
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
