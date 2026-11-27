import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError, logWarn } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";
import { hashPassword, verifyPassword } from "@/lib/crypt";
import { read_User_Password_Hash, update_User_Password_Hash } from "@/app/db-data/user";
import { delete_All_User_Sessions, delete_Other_User_Sessions } from "@/app/db-data/user-session";
import { createLog } from "@/app/db-data/log";
import { LOGIN_FAILED_MESSAGE, loginLockedUntil } from "@/app/db-data/auth";
import { PASSWORD_CHANGED_MESSAGE, password_Change_Schema } from "@/types/password-change";

// The logged-in user changes their own password (profile). Never log the request body:
// it contains passwords.
// - Only for the session's own user (403 otherwise).
// - A wrong current password is written to LOG as a failed login, so it counts toward the
//   login lockout: a stolen session can't be used to guess the password.
// - After the change, all the user's sessions are ended, the current one included:
//   the browser signs out and logs in again with the new password.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/password';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} POST route`, err);
    return NextResponse.json({ error: `${pathname} POST route ${err.message}` }, { status: HttpStatus.UNAUTHORIZED });
  }
  const userId = session.user.id;
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot change the password of user ${urlUserId}`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json({ error: `${pathname} POST route ${err.message}` }, { status: HttpStatus.FORBIDDEN });
  }

  try {
    const lockedUntil = await loginLockedUntil(userId);
    if (lockedUntil) {
      return NextResponse.json(
        { error: `Trop d'essais : réessayer après ${lockedUntil.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` },
        { status: HttpStatus.TOO_MANY_REQUESTS }
      );
    }

    const parsed = password_Change_Schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: HttpStatus.BAD_REQUEST }
      );
    }
    const { current_password, new_password } = parsed.data;

    if (!await verifyPassword(current_password, await read_User_Password_Hash(userId))) {
      logWarn(`${pathname} POST route`, `wrong current password for user "${userId}"`);
      await createLog({
        id: 0, date_oper: new Date(), user_id: userId, severite: 'warn',
        message: LOGIN_FAILED_MESSAGE, contexte: JSON.stringify({ source: 'password change' }),
      });
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: HttpStatus.BAD_REQUEST });
    }

    await update_User_Password_Hash(userId, await hashPassword(new_password));
    const otherSessionsEnded = await delete_Other_User_Sessions(userId, session.sessionUuid);
    await delete_All_User_Sessions(userId); // the current session too
    await createLog({
      id: 0, date_oper: new Date(), user_id: userId, severite: 'info',
      message: PASSWORD_CHANGED_MESSAGE, contexte: JSON.stringify({ otherSessionsEnded }),
    });

    return NextResponse.json({ otherSessionsEnded });
  }
  catch (err: unknown) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
