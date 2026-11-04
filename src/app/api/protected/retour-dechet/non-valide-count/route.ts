import { retour_Dechet_Non_Valide_Count } from "@/app/db-data/retour-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";
import { RETOUR_DECHET_TABLE_NAME } from "@/types/retour-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET() {
  const pathname = '/retour-dechet/non-valide-count';
  if (! await checkRole(RETOUR_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_TABLE_NAME}.LIST`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await retour_Dechet_Non_Valide_Count();

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