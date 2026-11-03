'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { sortie_Dechet_Count, sortie_Dechet_List } from "@/app/db-data/sortie-dechet";
import { Empty_Sortie_Dechet, SORTIE_DECHET_DEFAULT_SORT, Sortie_Dechet_Type } from "@/types/sortie-dechet";
import { consoleInfo } from "@/lib/clientLog";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Sortie_Dechet GET searchParams....................:", searchParams);
    const params : TableState<Sortie_Dechet_Type> = httpListParams<Sortie_Dechet_Type>(searchParams, SORTIE_DECHET_DEFAULT_SORT)
    //consoleInfo("Sortie_Dechet GET params-------------------:", params);
    const quickSearchColumns :  (keyof Sortie_Dechet_Type)[] =  ['numero', 'client_code', 'client_raison_sociale','date_piece','montant','montant_regle','valide','controle',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Sortie_Dechet_Type>(params, Empty_Sortie_Dechet, quickSearchColumns);
    consoleInfo("Sortie_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => sortie_Dechet_List(prismaParams), () => sortie_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('sortie-dechet GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}