import { NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { delete_User_Table_Filter, update_User_Table_Filter } from "@/app/db-data/user-table-filter";
import { logError } from "@/lib/serverLog";

export async function PUT(request: Request) {
  const pathname = '/user/[id]/table-filter/[childId]';
  try {
    const req = await request.json();
    //consoleInfo('user-table-filter PUT req: ', req);
    const userId = req.user_id;
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
      { error: `${pathname} PUT route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: Request) {
  const pathname = '/user/[id]/table-filter/[childId]';
  try {
    const data = await request.json();
    const id=data.id
    const item = await delete_User_Table_Filter(id);
    return NextResponse.json(item);
  } 
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}