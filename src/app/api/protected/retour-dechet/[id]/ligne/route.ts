'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { retour_Dechet_Ligne_Count, retour_Dechet_Ligne_List } from "@/app/db-data/retour-dechet-ligne";
import { Empty_Retour_Dechet_Ligne, RETOUR_DECHET_LIGNE_DEFAULT_SORT, Retour_Dechet_Ligne_Type } from "@/types/retour-dechet-ligne";
import { addTableStateFilter } from "@/lib/lib";
//import { consoleInfo } from "@/lib/log";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prms = await params;
  const id = prms.id;
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Retour_Dechet_Ligne_Type> = httpListParams<Retour_Dechet_Ligne_Type>(searchParams, RETOUR_DECHET_LIGNE_DEFAULT_SORT)
    const masterFilter : Filter<Retour_Dechet_Ligne_Type> = {'retour_dechet_numero': id }
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof Retour_Dechet_Ligne_Type)[] =  ['id', 'retour_dechet_numero','unite', 'ligne_numero','article_code','article_designation','quantite','prix_vente','montant',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Retour_Dechet_Ligne_Type>(mergedParams, Empty_Retour_Dechet_Ligne, quickSearchColumns);
    //consoleInfo("Retour_Dechet_Ligne GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => retour_Dechet_Ligne_List(prismaParams), () => retour_Dechet_Ligne_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('retour-dechet/${id}/ligne GET route', err);
    return NextResponse.json(
      { error: `retour-dechet/${id}/ligne route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}