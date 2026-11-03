'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { client_Dechet_Count, client_Dechet_List } from "@/app/db-data/client-dechet";
import { Empty_Client_Dechet, CLIENT_DECHET_DEFAULT_SORT, Client_Dechet_Type } from "@/types/client-dechet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Client_Dechet_Type> = httpListParams<Client_Dechet_Type>(searchParams, CLIENT_DECHET_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Client_Dechet_Type)[] =  ['code',  'raison_sociale',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Client_Dechet_Type>(params, Empty_Client_Dechet, quickSearchColumns);
    //consoleInfo("Client_Dechet GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => client_Dechet_List(prismaParams), () => client_Dechet_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('client-dechet GET route', err);
    return NextResponse.json(
      { error: `client-dechet route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}