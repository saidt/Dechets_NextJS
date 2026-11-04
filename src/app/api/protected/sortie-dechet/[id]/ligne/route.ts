import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { sortie_Dechet_Ligne_Count, sortie_Dechet_Ligne_List } from "@/app/db-data/sortie-dechet-ligne";
import { Empty_Sortie_Dechet_Ligne, SORTIE_DECHET_LIGNE_DEFAULT_SORT, Sortie_Dechet_Ligne_Type, SORTIE_DECHET_LIGNE_TABLE_NAME } from "@/types/sortie-dechet-ligne";
import { addTableStateFilter } from "@/lib/lib";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
//import { consoleInfo } from "@/lib/log";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/sortie-dechet/[id]/ligne';
  if (! await checkRole(SORTIE_DECHET_LIGNE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_LIGNE_TABLE_NAME}.LIST`);
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
    const params : TableState<Sortie_Dechet_Ligne_Type> = httpListParams<Sortie_Dechet_Ligne_Type>(searchParams, SORTIE_DECHET_LIGNE_DEFAULT_SORT)
    const masterFilter : Filter<Sortie_Dechet_Ligne_Type> = {'sortie_dechet_numero': id }
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof Sortie_Dechet_Ligne_Type)[] =  ['id', 'sortie_dechet_numero','unite', 'ligne_numero','article_code','article_designation','quantite','prix_vente','montant',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Sortie_Dechet_Ligne_Type>(mergedParams, Empty_Sortie_Dechet_Ligne, quickSearchColumns);
    //consoleInfo("Sortie_Dechet_Ligne GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => sortie_Dechet_Ligne_List(prismaParams), () => sortie_Dechet_Ligne_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}