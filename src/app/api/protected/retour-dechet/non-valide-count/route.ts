import { retour_Dechet_Non_Valide_Count } from "@/app/db-data/retour-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await retour_Dechet_Non_Valide_Count();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('retour-dechet/non-valide-count GET route', err);
    return NextResponse.json(
      { error: `retour-dechet/non-valide-count route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}