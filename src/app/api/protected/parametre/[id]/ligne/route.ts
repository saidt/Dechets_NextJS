import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { parametre_Ligne_Count, parametre_Ligne_List } from "@/app/db-data/parametre-ligne";
import { Empty_Parametre_Ligne, PARAMETRE_LIGNE_DEFAULT_SORT, Parametre_Ligne_Type, PARAMETRE_LIGNE_TABLE_NAME } from "@/types/parametre-ligne";
import { addTableStateFilter } from "@/lib/lib";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/parametre/[id]/ligne';
  if (! await checkRole(PARAMETRE_LIGNE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${PARAMETRE_LIGNE_TABLE_NAME}.LIST`);
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
    const params : TableState<Parametre_Ligne_Type> = httpListParams<Parametre_Ligne_Type>(searchParams, PARAMETRE_LIGNE_DEFAULT_SORT)
    const masterFilter : Filter<Parametre_Ligne_Type> = {'parametre_rubrique': { value: id, exactFilter: true } } // adjust to master column name !
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof Parametre_Ligne_Type)[] =  ['id', 'parametre_rubrique', 'code','designation',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Parametre_Ligne_Type>(mergedParams, Empty_Parametre_Ligne, quickSearchColumns);
    //consoleInfo("Parametre_Ligne GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => parametre_Ligne_List(prismaParams), () => parametre_Ligne_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}