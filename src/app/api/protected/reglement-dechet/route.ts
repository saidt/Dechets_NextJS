import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { reglement_Dechet_Count, reglement_Dechet_List } from "@/app/db-data/reglement-dechet";
import { Empty_Reglement_Dechet, REGLEMENT_DECHET_DEFAULT_SORT, Reglement_Dechet_Type, REGLEMENT_DECHET_TABLE_NAME } from "@/types/reglement-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
  const pathname = '/reglement-dechet';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Reglement_Dechet_Type> = httpListParams<Reglement_Dechet_Type>(searchParams, REGLEMENT_DECHET_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Reglement_Dechet_Type)[] =  ['numero', 'client_code', 'date_piece','client_raison_sociale','montant','montant_regle','montant_verse','valide',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Reglement_Dechet_Type>(params, Empty_Reglement_Dechet, quickSearchColumns);
    //consoleInfo("Reglement_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => reglement_Dechet_List(prismaParams), () => reglement_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}