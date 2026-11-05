import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { read_User } from "@/app/db-data/user";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own data: the user id comes from the session
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
    const data = await read_User(userId)
    //consoleInfo('user/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}