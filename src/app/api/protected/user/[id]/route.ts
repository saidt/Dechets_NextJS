'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { read_User } from "@/app/db-data/user";
import { logError } from "@/lib/serverLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('user GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "user/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_User(id)
    //consoleInfo('user/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('user/[id] GET route', err);
    return NextResponse.json(
      { error: `user/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}