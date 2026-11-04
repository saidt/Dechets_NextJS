import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/types/http";
import { read_Pesee } from "@/app/db-data/pesee";
import { logError } from "@/lib/serverLog";
import { PESEE_TABLE_NAME } from "@/types/pesee";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

//import { isDevMode } from "@/lib/lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/pesee/[id]';
  if (! await checkRole(PESEE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${PESEE_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //isDevMode() && console.log('Pesee GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Pesee(id)  
    //isDevMode() && console.log('pesee/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}