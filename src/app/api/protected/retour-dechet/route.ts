'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { retour_Dechet_Count, retour_Dechet_List } from "@/app/db-data/retour-dechet";
import { Empty_Retour_Dechet, RETOUR_DECHET_DEFAULT_SORT, Retour_Dechet_Type, RETOUR_DECHET_TABLE_NAME } from "@/types/retour-dechet";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
  const pathname = '/retour-dechet';
  if (! await checkRole(RETOUR_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Retour_Dechet_Type> = httpListParams<Retour_Dechet_Type>(searchParams, RETOUR_DECHET_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Retour_Dechet_Type)[] =  ['numero', 'client_code', 'client_raison_sociale','date_piece','montant','montant_regle','date_sortie','valide','controle',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Retour_Dechet_Type>(params, Empty_Retour_Dechet, quickSearchColumns);
    //consoleInfo("Retour_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => retour_Dechet_List(prismaParams), () => retour_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}