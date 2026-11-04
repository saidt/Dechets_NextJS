import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
import { credentials_Schema } from "@/types/credentials";
import { createSaltedSHA256Hash } from "@/lib/crypt";
import { USER_UPDATE_PSWD_ROLE } from "@/types/user";

// Generates a password hash for USER_.PSW_HASH. Display only: nothing is written
// to the database. Never log the request body: it contains the password.
export async function POST(request: NextRequest) {
  const pathname = '/user/password-hash';
  if (! await checkRole(USER_UPDATE_PSWD_ROLE)) {
    const err = new Error(`Forbidden: ${USER_UPDATE_PSWD_ROLE}`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const body = await request.json();
    const parsed = credentials_Schema.safeParse({ userId: body?.userId, password: body?.password });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const hash = createSaltedSHA256Hash(parsed.data.userId, parsed.data.password);
    return NextResponse.json({ hash });
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
