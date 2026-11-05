import { NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { delete_User_Table_Filter, update_User_Table_Filter } from "@/app/db-data/user-table-filter";
import { logError } from "@/lib/serverLog";
import { getErrorMessage } from "@/lib/errorMessage";
import { getValidSession, isSameUser } from "@/lib/auth-lib";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; childId: string }> }
) {
  const pathname = '/user/[id]/table-filter/[childId]';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own data: the user id comes from the session
  const userId = session.user.id;
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const req = await request.json();
    //consoleInfo('user-table-filter PUT req: ', req);
    const tableName = req.table_name;
    const filterName = req.filter_name;
    const filter = req.filter;
    //consoleInfo('user-table-filter PUT userId: ', userId);
    //consoleInfo('user-table-filter PUT tableName: ', tableName);
    //consoleInfo('user-table-filter PUT filterName: ', filterName);
    //consoleInfo('user-table-filter PUT filter: ', filter);
    
    const result = await update_User_Table_Filter(userId, tableName, filterName, filter);
    
    if (! result.success) {
      logError(`${pathname} PUT route`, result.error);
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result.data, { status: HttpStatus.OK })
  } 
  catch (err: any) {
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; childId: string }> }
) {
  const pathname = '/user/[id]/table-filter/[childId]';
  const session = await getValidSession();
  if (!session) {
    const err = new Error('Session not found or expired !');
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  // Only the logged-in user's own data: the user id comes from the session
  const userId = session.user.id;
  const { id: urlUserId } = await params;
  if (!isSameUser(urlUserId, userId)) {
    const err = new Error(`Forbidden: user ${userId} cannot access user ${urlUserId}`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.FORBIDDEN }
    );
  }
  try {
    const data = await request.json();
    const id = Number(data.id)
    const item = await delete_User_Table_Filter(id, userId);
    if (!item) {
      return NextResponse.json(
        { error: `${pathname} DELETE route filter ${id} not found` },
        { status: HttpStatus.NOT_FOUND }
      );
    }
    return NextResponse.json(item);
  } 
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}