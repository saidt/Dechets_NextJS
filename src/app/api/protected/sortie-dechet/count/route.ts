import { sortie_Dechet_Count } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";
import { SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
import { execScalarFunction } from "@/lib/db";

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
    const dateDeb = await execScalarFunction<Date>('dbo.d_DATE_DEBUT_PERIODE');
    const dateFin = await execScalarFunction<Date>('dbo.d_DATE_FIN_PERIODE')
    const result = await sortie_Dechet_Count({ date_piece: { gte: dateDeb, lte: dateFin } });

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