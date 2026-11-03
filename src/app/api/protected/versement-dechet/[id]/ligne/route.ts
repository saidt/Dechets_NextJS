'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { versement_Dechet_Ligne_Count, versement_Dechet_Ligne_List } from "@/app/db-data/versement-dechet-ligne";
import { Empty_Versement_Dechet_Ligne, VERSEMENT_DECHET_LIGNE_DEFAULT_SORT, Versement_Dechet_Ligne_Type, VERSEMENT_DECHET_LIGNE_TABLE_NAME } from "@/types/versement-dechet-ligne";
import { addTableStateFilter } from "@/lib/lib";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/versement-dechet/[id]/ligne';
  if (! await checkRole(VERSEMENT_DECHET_LIGNE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_LIGNE_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  const prms = await params;
  const id = prms.id;
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Versement_Dechet_Ligne_Type> = httpListParams<Versement_Dechet_Ligne_Type>(searchParams, VERSEMENT_DECHET_LIGNE_DEFAULT_SORT)
	  const masterFilter : Filter<Versement_Dechet_Ligne_Type> = {'versement_dechet_numero': id } // adjust to master column name !
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof Versement_Dechet_Ligne_Type)[] =  ['id', 'reglement_dechet_numero','versement_dechet_numero', 'montant',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Versement_Dechet_Ligne_Type>(mergedParams, Empty_Versement_Dechet_Ligne, quickSearchColumns);
    //consoleInfo("Versement_Dechet_Ligne GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => versement_Dechet_Ligne_List(prismaParams), () => versement_Dechet_Ligne_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}