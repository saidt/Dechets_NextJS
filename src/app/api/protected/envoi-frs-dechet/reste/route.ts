import { envoi_Frs_Dechet_Reste } from "@/app/db-data/envoi-frs-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { ENVOI_FRS_DECHET_TABLE_NAME } from "@/types/envoi-frs-dechet";
import { checkRole } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest
) {
  const pathname = '/envoi-frs-dechet/reste';
  if (! await checkRole(ENVOI_FRS_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${ENVOI_FRS_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await envoi_Frs_Dechet_Reste();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}