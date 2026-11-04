import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { read_User } from "@/app/db-data/user";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { checkLoggedIn } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]';
  if (! await checkLoggedIn()) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('user GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_User(id)
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