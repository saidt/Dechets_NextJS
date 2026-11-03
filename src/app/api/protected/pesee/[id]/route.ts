'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { read_Pesee } from "@/app/db-data/pesee";
import { logError } from "@/lib/serverLog";

//import { isDevMode } from "@/lib/lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prms = await params;
    const id = prms.id;


    //isDevMode() && console.log('Pesee GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "pesee/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Pesee(id)  
    //isDevMode() && console.log('pesee/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('pesee/[id] GET route', err);
    return NextResponse.json(
      { error: `pesee/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}