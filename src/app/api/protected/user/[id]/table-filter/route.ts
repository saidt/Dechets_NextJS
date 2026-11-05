import { NextRequest, NextResponse } from "next/server";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { Empty_User_Table_Filter, USER_TABLE_FILTER_DEFAULT_SORT, User_Table_Filter_Type } from "@/types/user-table-filter";
import { PrismaQuery, TableState } from "@/lib/types";
import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { user_Table_Filter_Count, user_Table_Filter_List } from "@/app/db-data/user-table-filter";
import { logError } from "@/lib/serverLog";
import { addTableStateFilter } from "@/lib/lib";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/table-filter';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own data: the user id comes from the session
  const userId = session.user.id;
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("user-table-filter GET searchParams....................:", searchParams);
    const params : TableState<User_Table_Filter_Type> = httpListParams<User_Table_Filter_Type>(searchParams, USER_TABLE_FILTER_DEFAULT_SORT)
    // user_id is not taken from the column filters: it is forced to the session user below
    const columnFilter = { ...params.filter }
    delete columnFilter.user_id
    const mergedParams = addTableStateFilter({ ...params, filter: columnFilter }, {})
    const quickSearchColumns :  (keyof User_Table_Filter_Type)[] = ['id','user_id','table_name','filter_name','type', 'filter']
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<User_Table_Filter_Type>(mergedParams, Empty_User_Table_Filter, quickSearchColumns);
    // Exact match (column filters use 'contains', which would also match e.g. ALI2 for ALI)
    prismaParams.where = prismaParams.where ? { AND: [prismaParams.where, { user_id: userId }] } : { user_id: userId };
    //consoleInfo("user-table-filter GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => user_Table_Filter_List(prismaParams), () => user_Table_Filter_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}