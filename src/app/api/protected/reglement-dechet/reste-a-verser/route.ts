import { reglement_Dechet_Reste_A_Verser } from "@/app/db-data/reglement-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { REGLEMENT_DECHET_TABLE_NAME } from "@/types/reglement-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(
  request: NextRequest
) {
  const pathname = '/reglement-dechet/reste-a-verser';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await reglement_Dechet_Reste_A_Verser();

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