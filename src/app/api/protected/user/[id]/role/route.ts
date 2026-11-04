import { NextRequest, NextResponse } from "next/server";
import { httpList, httpListParams, HttpStatus } from "@/types/http";
import { user_Role_Count, user_Role_List } from "@/app/db-data/user-role";
import { Empty_User_Role, USER_ROLE_DEFAULT_SORT, User_Role_Type } from "@/types/user-role";
import { Filter, PrismaQuery, TableState } from "@/lib/types";
import { tableStateToPrismaQuery } from "@/lib/prismaUtils";
import { logError } from "@/lib/serverLog";
import { addTableStateFilter } from "@/lib/lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function  GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/user/[id]/role';
  const prms = await params;
  const id = prms.id;
  try {
    const searchParams = request.nextUrl.searchParams
    //consoleInfo("User-role GET searchParams....................:", searchParams);
    const params : TableState<User_Role_Type> = httpListParams<User_Role_Type>(searchParams, USER_ROLE_DEFAULT_SORT)
    const masterFilter : Filter<User_Role_Type> = {'user_id': id }
    const mergedParams = addTableStateFilter(params, masterFilter)
    const quickSearchColumns :  (keyof User_Role_Type)[] = ['id','user_id','role_id']
    const prismaParams : PrismaQuery = tableStateToPrismaQuery<User_Role_Type>(mergedParams, Empty_User_Role, quickSearchColumns);
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