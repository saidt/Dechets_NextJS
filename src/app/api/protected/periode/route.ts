'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { periode_Count, periode_List } from "@/app/db-data/periode";
import { Empty_Periode, PERIODE_DEFAULT_SORT, Periode_Type } from "@/types/periode";
//import { consoleInfo } from "@/lib/log";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Periode_Type> = httpListParams<Periode_Type>(searchParams, PERIODE_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Periode_Type)[] =  ['code',  'date_deb','date_fin',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Periode_Type>(params, Empty_Periode, quickSearchColumns);
    //consoleInfo("Periode GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => periode_List(prismaParams), () => periode_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('periode GET route', err);
    return NextResponse.json(
      { error: `periode route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}