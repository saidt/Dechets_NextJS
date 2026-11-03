import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { versement_Dechet_Count, versement_Dechet_List } from "@/app/db-data/versement-dechet";
import { Empty_Versement_Dechet, VERSEMENT_DECHET_DEFAULT_SORT, Versement_Dechet_Type, VERSEMENT_DECHET_TABLE_NAME } from "@/types/versement-dechet";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
  const pathname = '/versement-dechet';
  if (! await checkRole(VERSEMENT_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Versement_Dechet_Type> = httpListParams<Versement_Dechet_Type>(searchParams, VERSEMENT_DECHET_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Versement_Dechet_Type)[] =  ['numero',  'date_piece','valide',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Versement_Dechet_Type>(params, Empty_Versement_Dechet, quickSearchColumns);
    //consoleInfo("Versement_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => versement_Dechet_List(prismaParams), () => versement_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}