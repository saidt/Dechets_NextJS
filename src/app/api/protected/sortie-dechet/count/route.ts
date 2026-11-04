import { sortie_Dechet_Count } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";
import { SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET() {
  const pathname = '/sortie-dechet/count';
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await sortie_Dechet_Count({});

    return new Response(JSON.stringify({count: result}), {
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