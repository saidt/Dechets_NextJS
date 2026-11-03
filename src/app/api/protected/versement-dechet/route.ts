'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { versement_Dechet_Count, versement_Dechet_List } from "@/app/db-data/versement-dechet";
import { Empty_Versement_Dechet, VERSEMENT_DECHET_DEFAULT_SORT, Versement_Dechet_Type } from "@/types/versement-dechet";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
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
    logError('versement-dechet GET route', err);
    return NextResponse.json(
      { error: `versement-dechet route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}