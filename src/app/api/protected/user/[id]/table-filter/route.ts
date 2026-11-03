import { NextRequest, NextResponse } from "next/server";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { Empty_User_Table_Filter, USER_TABLE_FILTER_DEFAULT_SORT, User_Table_Filter_Type } from "@/types/user-table-filter";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { user_Table_Filter_Count, user_Table_Filter_List } from "@/app/db-data/user-table-filter";
import { logError } from "@/lib/serverLog";
import { addTableStateFilter } from "@/lib/lib";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/table-filter';
  const prms = await params;
  const id = prms.id;
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("user-table-filter GET searchParams....................:", searchParams);
    const params : TableState<User_Table_Filter_Type> = httpListParams<User_Table_Filter_Type>(searchParams, USER_TABLE_FILTER_DEFAULT_SORT)
    const masterFilter : Filter<User_Table_Filter_Type> = {'user_id': id }
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof User_Table_Filter_Type)[] = ['id','user_id','table_name','filter_name','type', 'filter']
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<User_Table_Filter_Type>(mergedParams, Empty_User_Table_Filter, quickSearchColumns);
    //consoleInfo("user-table-filter GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => user_Table_Filter_List(prismaParams), () => user_Table_Filter_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}