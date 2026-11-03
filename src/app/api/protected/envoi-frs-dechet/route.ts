'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { envoi_Frs_Dechet_Count, envoi_Frs_Dechet_List } from "@/app/db-data/envoi-frs-dechet";
import { Empty_Envoi_Frs_Dechet, ENVOI_FRS_DECHET_DEFAULT_SORT, Envoi_Frs_Dechet_Type } from "@/types/envoi-frs-dechet";
//import { isDevMode } from "@/lib/lib";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    //isDevMode() && console.log("Item GET searchParams....................:", searchParams);
    const params : TableState<Envoi_Frs_Dechet_Type> = httpListParams<Envoi_Frs_Dechet_Type>(searchParams, ENVOI_FRS_DECHET_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Envoi_Frs_Dechet_Type)[] =  ['id', 'article_code', 'annee','no_dos_exp','no_cmd_exp','date_cmd','quantite',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Envoi_Frs_Dechet_Type>(params, Empty_Envoi_Frs_Dechet, quickSearchColumns);
    //isDevMode() && console.log("Envoi_Frs_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => envoi_Frs_Dechet_List(prismaParams), () => envoi_Frs_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('envoi-frs-dechet GET route', err);
    return NextResponse.json(
      { error: `envoi-frs-dechet route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}