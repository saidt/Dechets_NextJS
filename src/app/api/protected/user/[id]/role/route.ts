import { NextRequest, NextResponse } from "next/server";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { user_Role_Count, user_Role_List } from "@/app/db-data/user-role";
import { Empty_User_Role, USER_ROLE_DEFAULT_SORT, User_Role_Type } from "@/types/user-role";
import { PrismaQuery, TableState } from "@/lib/types";
import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { logError } from "@/lib/serverLog";
import { addTableStateFilter } from "@/lib/lib";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/role';
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
    //consoleInfo("User-role GET searchParams....................:", searchParams);
    const params : TableState<User_Role_Type> = httpListParams<User_Role_Type>(searchParams, USER_ROLE_DEFAULT_SORT)
    // user_id is not taken from the column filters: it is forced to the session user below
    const columnFilter = { ...params.filter }
    delete columnFilter.user_id
    const mergedParams = addTableStateFilter({ ...params, filter: columnFilter }, {})
    const quickSearchColumns :  (keyof User_Role_Type)[] = ['id','user_id','role_id']
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<User_Role_Type>(mergedParams, Empty_User_Role, quickSearchColumns);
    // Exact match (column filters use 'contains', which would also match e.g. ALI2 for ALI)
    prismaParams.where = prismaParams.where ? { AND: [prismaParams.where, { user_id: userId }] } : { user_id: userId };
    //consoleInfo("User-role GET prismaParams================:", JSON.stringify(prismaParams));

    return httpList<any>(() => user_Role_List(prismaParams), () => user_Role_Count(prismaParams.where) )
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}