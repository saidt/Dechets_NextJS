import { envoi_Frs_Dechet_Reste } from "@/app/db-data/envoi-frs-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    const result = await envoi_Frs_Dechet_Reste();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('envoi-frs-dechet/reste GET route', err);
    return NextResponse.json(
      { error: `envoi-frs-dechet/reste GET route: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}