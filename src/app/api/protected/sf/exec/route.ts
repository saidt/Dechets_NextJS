'use server';

//import { exists_User_Role } from "@/app/db-data/user-role";
import { authOptions } from "@/lib/auth";
import { execScalarFunction } from "@/lib/db";
import { consoleInfo } from "@/lib/clientLog";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = '/sf/exec';
  try {
    const session = await getServerSession(authOptions);

    if (! session) {
      const err = new Error('Session not found  !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: `${pathname} GET route ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    if (! session.user || ! session.user.id) {
      const err = new Error('User not found  !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: `${pathname} GET route ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }

    const searchParams = request.nextUrl.searchParams
    consoleInfo("sf exec GET searchParams....................:", searchParams);
    const sfName = searchParams.get('sfName')
    consoleInfo("sf exec GET sfName....................:", sfName);

    if (! sfName) {
      const err = new Error('sfName not found !')
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: `${pathname} GET route ${String(err)}` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    /*const userId = session.user.id
    const roleId = sfName+'.EXEC'

    if (! await exists_User_Role(userId, roleId)) {
      const err = new Error(`User ${userId} does not have ${roleId} role  !`)
      logError(`${pathname} GET route`, err);
      return NextResponse.json(
        { error: `${pathname} GET route ${String(err)}` },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }*/

    const paramsStr = searchParams.get('params')
    consoleInfo("sf exec GET params....................:", paramsStr);
    const params : Stored_Proc_Param_Type[] = paramsStr ? JSON.parse(paramsStr) : []

    const data = await execScalarFunction(sfName, params)

    return NextResponse.json(
      { data }, 
      { status: HttpStatus.OK }
    );
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}