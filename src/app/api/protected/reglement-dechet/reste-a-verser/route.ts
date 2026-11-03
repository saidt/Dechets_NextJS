import { reglement_Dechet_Reste_A_Verser } from "@/app/db-data/reglement-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    const result = await reglement_Dechet_Reste_A_Verser();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('reglement-dechet/reste-a-verser GET route', err);
    return NextResponse.json(
      { error: `reglement-dechet/reste-a-verser GET route: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}