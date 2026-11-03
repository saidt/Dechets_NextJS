import { sortie_Dechet_Maj_Prix_Detail } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { checkRole } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.UPDATE`);
    logError('sortie-dechet/[id]/maj-prix-detail GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id]/maj-prix-detail route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    const result = await sortie_Dechet_Maj_Prix_Detail(Number(id));

    return new Response(JSON.stringify(result), {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
  } 
  catch (err: any) {
    logError('sortie-dechet maj-prix-detail GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet maj-prix-detail route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}