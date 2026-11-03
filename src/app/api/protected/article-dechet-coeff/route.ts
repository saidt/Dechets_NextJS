'use server';

import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { PrismaQuery, TableState } from "@/lib/types";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";
import { NextRequest, NextResponse } from "next/server";
import { article_Dechet_Coeff_Count, article_Dechet_Coeff_List } from "@/app/db-data/article-dechet-coeff";
import { Empty_Article_Dechet_Coeff, ARTICLE_DECHET_COEFF_DEFAULT_SORT, Article_Dechet_Coeff_Type } from "@/types/article-dechet-coeff";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("Item GET searchParams....................:", searchParams);
    const params : TableState<Article_Dechet_Coeff_Type> = httpListParams<Article_Dechet_Coeff_Type>(searchParams, ARTICLE_DECHET_COEFF_DEFAULT_SORT)
    const quickSearchColumns :  (keyof Article_Dechet_Coeff_Type)[] =  ['article_code', 'article_code', 'coeff',] 
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<Article_Dechet_Coeff_Type>(params, Empty_Article_Dechet_Coeff, quickSearchColumns);
    //consoleInfo("Article_Dechet_Coeff GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => article_Dechet_Coeff_List(prismaParams), () => article_Dechet_Coeff_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError('article-dechet-coeff GET route', err);
    return NextResponse.json(
      { error: `article-dechet-coeff route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}