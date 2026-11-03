import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { unite_Conversion_Count, unite_Conversion_List } from "@/app/db-data/unite-conversion";
import { Empty_Unite_Conversion, UNITE_CONVERSION_DEFAULT_SORT, Unite_Conversion_Type, UNITE_CONVERSION_TABLE_NAME } from "@/types/unite-conversion";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
  const pathname = '/unite-conversion';
  if (! await checkRole(UNITE_CONVERSION_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${UNITE_CONVERSION_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Unite_Conversion_Type> = httpListParams<Unite_Conversion_Type>(searchParams, UNITE_CONVERSION_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Unite_Conversion_Type)[] =  ['id', 'unite_source','unite_destination', 'coeff',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Unite_Conversion_Type>(params, Empty_Unite_Conversion, quickSearchColumns);
    //consoleInfo("Unite_Conversion GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => unite_Conversion_List(prismaParams), () => unite_Conversion_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}