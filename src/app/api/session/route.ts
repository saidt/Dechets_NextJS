import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { session } from "@/app/db-data/auth";
import { logError } from "@/lib/serverLog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //consoleInfo('api session body ', JSON.stringify(body))
    const { uuid } = body;
    //consoleInfo('api session token :', token);

    if (uuid) {
      const data = await session(uuid);
      //consoleInfo('api session data :', JSON.stringify(data));

      return NextResponse.json(
        { data }, 
        { status: HttpStatus.OK }
      );
    }
    else {
      return NextResponse.json(
        { error: "uuid not found" },
        { status: HttpStatus.BAD_REQUEST }
    );  
    }
  } 
  catch (err: any) {
    logError('session POST  route', err);
    return NextResponse.json(
      { error: String(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}