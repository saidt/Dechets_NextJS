import { sortie_Dechet_Non_Valide_Count } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";
import { SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { checkRole } from "@/lib/auth-lib";

export async function GET() {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.LIST')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.LIST`);
    logError('sortie-dechet/non-valide-count GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet/non-valide-count route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const result = await sortie_Dechet_Non_Valide_Count();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('sortie-dechet/non-valide-count GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet/non-valide-count route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }  
}