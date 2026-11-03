import { NextRequest, NextResponse } from "next/server";
import { Credentials, credentials_Schema } from "@/types/credentials";
import { HttpStatus } from "@/types/http";
import { dbLogin } from "@/app/db-data/auth";
import { localLog } from "@/components/logger/localLog";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //consoleInfo('api login body ', JSON.stringify(body))
    const { userId, password } = body;
    const credentials : Credentials = credentials_Schema.parse({ userId, password });
    //consoleInfo('api login parsed credentials :', JSON.stringify(credentials));

    const user = await dbLogin(credentials);
    //consoleInfo('api login user :', JSON.stringify(user));

    const msg = user ? 'success' : 'failed'
    const cookieHeader = (await cookies()).toString();
    localLog("info", "Api login "+msg, cookieHeader, {user: userId });
    remoteLog("info", "Api login "+msg, cookieHeader, {user: userId });

    return NextResponse.json({ user }, { status: HttpStatus.OK });
  } 
  catch (err: any) {
    logError('Login route POST', err);
    return NextResponse.json(
      { error: `login route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}