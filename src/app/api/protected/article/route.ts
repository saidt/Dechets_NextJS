'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { article_Count, article_List } from "@/app/db-data/article";
import { Empty_Article, ARTICLE_DEFAULT_SORT, Article_Type, ARTICLE_TABLE_NAME } from "@/types/article";
import { checkRole } from "@/lib/auth-lib";

export async function GET(request: NextRequest) {
  try {
    if (! await checkRole(ARTICLE_TABLE_NAME+'.LIST')) {
      const err = new Error(`Forbidden: ${ARTICLE_TABLE_NAME}.LIST`);
      logError('article GET route', err);
      return NextResponse.json(
        { error: `article route GET ${err.message}` },
        { status: HttpStatus.UNAUTHORIZED }
      );  
    }
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Article_Type> = httpListParams<Article_Type>(searchParams, ARTICLE_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Article_Type)[] =  ['code',  'designation','unite_stk','nature',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Article_Type>(params, Empty_Article, quickSearchColumns);
    //consoleInfo("Article GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => article_List(prismaParams), () => article_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('article GET route', err);
    return NextResponse.json(
      { error: `article route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}