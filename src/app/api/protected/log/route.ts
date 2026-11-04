import { logDebug, logError, logInfo, logWarn } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { checkLoggedIn } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function POST(req: NextRequest) {
  const pathname = '/log';
  if (! await checkLoggedIn()) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const body = await req.json();

    const {
      level = "info",
      message,
      context,
    } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: `${pathname} POST route message is required` }),
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const logMessage = context
      ? `${message} | context=${JSON.stringify(context)}`
      : message;

    switch (level) {
      case "debug":
        logDebug(logMessage, '');
        break;
      case "warn":
        logWarn(logMessage, '');
        break;
      case "error":
        logError(logMessage, '');
        break;
      default:
        logInfo(logMessage, '');
    }

    return NextResponse.json({ ok: true });
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.BAD_REQUEST }
    );
  }
}