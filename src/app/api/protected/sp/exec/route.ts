import { exists_User_Role } from "@/app/db-data/user-role";
import { execStoredProc } from "@/lib/db";
//import { consoleInfo } from "@/lib/log";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { getValidSession } from "@/lib/auth-lib";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/errorMessage";

// POST, not GET: stored procedures can update data (e.g. MAJ = 'O' correction mode). Browsers
// send the session cookie (SameSite=Lax) with cross-site links, so a GET could be triggered from
// another site; a cross-site POST is sent without it.
// Body: { spName: string, params: Stored_Proc_Param_Type[] }
export async function POST(request: NextRequest) {
  const pathname = '/sp/exec';
  try {
    const session = await getValidSession();

    if (! session) {
      const err = new Error('Session not found  !')
      logError(`${pathname} POST route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    if (! session.user || ! session.user.id) {
      const err = new Error('User not found  !')
      logError(`${pathname} POST route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    const body = await request.json().catch(() => ({}))
    const spName : string | undefined = typeof body?.spName === 'string' ? body.spName : undefined

    if (! spName) {
      const err = new Error('spName not found !')
      logError(`${pathname} POST route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const userId = session.user.id
    const roleId = spName+'.EXEC'

    if (! await exists_User_Role(userId, roleId)) {
      const err = new Error(`User ${userId} does not have ${roleId} role  !`)
      logError(`${pathname} POST route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    if (body?.params !== undefined && !Array.isArray(body.params)) {
      const err = new Error('params must be an array !')
      logError(`${pathname} POST route`, err);
      return NextResponse.json(
        { error: getErrorMessage(err) },
        { status: HttpStatus.BAD_REQUEST }
      );
    }
    const params : Stored_Proc_Param_Type[] = body?.params ?? []

    const data = await execStoredProc(spName, params)

    return NextResponse.json(
      { data }, 
      { status: HttpStatus.OK }
    );
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}