import { client_Dechet_Reste_A_Payer } from "@/app/db-data/client-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { CLIENT_DECHET_TABLE_NAME } from "@/types/client-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/client-dechet/[id]/reste-a-payer';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    const result = await client_Dechet_Reste_A_Payer(id);

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}