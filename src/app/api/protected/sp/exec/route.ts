'use server';

import { exists_User_Role } from "@/app/db-data/user-role";
import { authOptions } from "@/lib/auth";
import { execStoredProc } from "@/lib/db";
//import { consoleInfo } from "@/lib/log";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (! session) {
      const err = new Error('Session not found  !')
      logError('sp exec GET route', err);
      return NextResponse.json(
        { error: `sp exec route GET: ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    if (! session.user || ! session.user.id) {
      const err = new Error('User not found  !')
      logError('sp exec GET route', err);
      return NextResponse.json(
        { error: `sp exec route GET: ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    const searchParams = request.nextUrl.searchParams
    //consoleInfo("sp exec GET searchParams....................:", searchParams);
    const spName = searchParams.get('spName')
    //consoleInfo("sp exec GET spName....................:", spName);

    if (! spName) {
      const err = new Error('spName not found !')
      logError('sp exec GET route', err);
      return NextResponse.json(
        { error: `sp exec route GET: ${String(err)}` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const userId = session.user.id
    const roleId = spName+'.EXEC'

    if (! await exists_User_Role(userId, roleId)) {
      const err = new Error(`User ${userId} does not have ${roleId} role  !`)
      logError('sp exec GET route', err);
      return NextResponse.json(
        { error: `sp exec route GET: ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    const paramsStr = searchParams.get('params')
    //consoleInfo("sp exec GET params....................:", paramsStr);
    const params : Stored_Proc_Param_Type[] = paramsStr ? JSON.parse(paramsStr) : []

    const data = await execStoredProc(spName, params)

    return NextResponse.json(
      { data }, 
      { status: HttpStatus.OK }
    );
  }
  catch (err: any) {
    logError('sp exec GET route', err);
    return NextResponse.json(
      { error: `sp exec GET route: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}