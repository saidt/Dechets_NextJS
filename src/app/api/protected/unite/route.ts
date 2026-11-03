'use server';

import { unite_Count, unite_List } from "@/app/db-data/unite";
import { logError } from "@/lib/serverLog";
import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { Empty_Unite, UNITE_DEFAULT_SORT, Unite_Type } from "@/types/unite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    //throw new Error('unite_Count volontary error !')
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Unite GET searchParams....................:", searchParams);
    const params : TableState<Unite_Type> = httpListParams<Unite_Type>(searchParams, UNITE_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Unite_Type)[] = ['code','designation']
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Unite_Type>(params, Empty_Unite, quickSearchColumns);
    //consoleInfo("Unite GET prismaParams================:", JSON.stringify(prismaParams));

    return await httpList<any>(() => unite_List(prismaParams), () => unite_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('unite GET route', err);
    return NextResponse.json(
      { error: `unite route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}