'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { pesee_Count, pesee_List } from "@/app/db-data/pesee";
import { Empty_Pesee, PESEE_DEFAULT_SORT, Pesee_Type, PESEE_TABLE_NAME } from "@/types/pesee";
import { checkRole } from "@/lib/auth-lib";
//import { isDevMode } from "@/lib/lib";

export async function GET(request: NextRequest) {
  const pathname = '/pesee';
  if (! await checkRole(PESEE_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${PESEE_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //isDevMode() && console.log("Item GET searchParams....................:", searchParams);
    const params : TableState<Pesee_Type> = httpListParams<Pesee_Type>(searchParams, PESEE_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Pesee_Type)[] =  ['numero_1',  'date_1','heure_1','numero_2','date_2','heure_2','client_raison_sociale','frs_raison_sociale','article_designation','immatriculation','poids_brut','tare','poids_net','sens',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Pesee_Type>(params, Empty_Pesee, quickSearchColumns);
    //isDevMode() && console.log("Pesee GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => pesee_List(prismaParams), () => pesee_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}