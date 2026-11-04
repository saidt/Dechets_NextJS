import { exists_User_Role } from "@/app/db-data/user-role";
import { storedProcParams } from "@/lib/db";
import { consoleInfo } from "@/lib/clientLog";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { getValidSession } from "@/lib/auth-lib";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(request: NextRequest) {
  const pathname = '/sp/param';
  try {
    const session = await getValidSession();
    if (! session) {
      const err = new Error('Session not found  !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    if (! session.user || ! session.user.id) {
      const err = new Error('User not found  !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    const searchParams = request.nextUrl.searchParams
    consoleInfo("sp param GET searchParams....................:", searchParams);
    const spName = searchParams.get('spName')
    consoleInfo("sp param GET spName....................:", spName);

    if (! spName) {
      const err = new Error('spName not found !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.BAD_REQUEST }
      );  
    }

    const userId = session.user.id
    const roleId = spName+'.EXEC'

    if (! await exists_User_Role(userId, roleId)) {
      const err = new Error(`User ${userId} does not have ${roleId} role  !`)
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    const data = await storedProcParams(spName)

    return NextResponse.json(
      { data }, 
      { status: HttpStatus.OK }
    );
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}