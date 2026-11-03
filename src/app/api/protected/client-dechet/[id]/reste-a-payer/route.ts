import { client_Dechet_Reste_A_Payer } from "@/app/db-data/client-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prms = await params;
    const id = prms.id;
    const result = await client_Dechet_Reste_A_Payer(id);

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('client-dechet/[id]/reste-a-payer GET route', err);
    return NextResponse.json(
      { error: `client-dechet/[id]/reste-a-payer GET route: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}