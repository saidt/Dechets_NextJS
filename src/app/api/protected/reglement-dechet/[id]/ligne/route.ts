import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { reglement_Dechet_Ligne_Count, reglement_Dechet_Ligne_List } from "@/app/db-data/reglement-dechet-ligne";
import { Empty_Reglement_Dechet_Ligne, REGLEMENT_DECHET_LIGNE_DEFAULT_SORT, Reglement_Dechet_Ligne_Type, REGLEMENT_DECHET_LIGNE_TABLE_NAME } from "@/types/reglement-dechet-ligne";
import { addTableStateFilter } from "@/lib/lib";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/reglement-dechet/[id]/ligne';
  if (! await checkRole(REGLEMENT_DECHET_LIGNE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_LIGNE_TABLE_NAME}.LIST`);
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
    const params : TableState<Reglement_Dechet_Ligne_Type> = httpListParams<Reglement_Dechet_Ligne_Type>(searchParams, REGLEMENT_DECHET_LIGNE_DEFAULT_SORT)
    const masterFilter : Filter<Reglement_Dechet_Ligne_Type> = {'reglement_dechet_numero': id }
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof Reglement_Dechet_Ligne_Type)[] =  ['id', 'reglement_dechet_numero','sortie_dechet_numero', 'montant',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Reglement_Dechet_Ligne_Type>(mergedParams, Empty_Reglement_Dechet_Ligne, quickSearchColumns);
    //consoleInfo("Reglement_Dechet_Ligne GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => reglement_Dechet_Ligne_List(prismaParams), () => reglement_Dechet_Ligne_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}