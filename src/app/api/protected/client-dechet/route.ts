import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { client_Dechet_Count, client_Dechet_List } from "@/app/db-data/client-dechet";
import { Empty_Client_Dechet, CLIENT_DECHET_DEFAULT_SORT, Client_Dechet_Type, CLIENT_DECHET_TABLE_NAME } from "@/types/client-dechet";
import { checkRole } from "@/lib/auth-lib";

export async function GET(request: NextRequest) {
  const pathname = '/client-dechet';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
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
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}