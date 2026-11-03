import { retour_Dechet_Count } from "@/app/db-data/retour-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";
import { RETOUR_DECHET_TABLE_NAME } from "@/types/retour-dechet";
import { checkRole } from "@/lib/auth-lib";

export async function GET() {
  const pathname = '/retour-dechet/count';
  if (! await checkRole(RETOUR_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await retour_Dechet_Count({});
    return new Response(JSON.stringify({count: result}), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}