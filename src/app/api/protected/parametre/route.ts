import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { parametre_Count, parametre_List } from "@/app/db-data/parametre";
import { Empty_Parametre, PARAMETRE_DEFAULT_SORT, Parametre_Type, PARAMETRE_TABLE_NAME } from "@/types/parametre";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(request: NextRequest) {
  const pathname = '/parametre';
  if (! await checkRole(PARAMETRE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${PARAMETRE_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Parametre_Type> = httpListParams<Parametre_Type>(searchParams, PARAMETRE_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Parametre_Type)[] =  ['rubrique',  'designation',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Parametre_Type>(params, Empty_Parametre, quickSearchColumns);
    //consoleInfo("Parametre GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => parametre_List(prismaParams), () => parametre_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}