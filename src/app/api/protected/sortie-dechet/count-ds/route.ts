import { sortie_Dechet_Count_DataSet } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sortie_Dechet_Count_DataSet();

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('sortie-dechet-count-ds GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet-count-ds route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}