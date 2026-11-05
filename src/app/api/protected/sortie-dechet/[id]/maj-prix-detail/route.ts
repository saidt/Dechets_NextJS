import { sortie_Dechet_Maj_Prix_Detail } from "@/app/db-data/sortie-dechet";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import { SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

// POST, not GET: this runs an update (SORTIE_DECHET_DETAIL_MAJ_PRIX_VENTE). Browsers send
// the session cookie (SameSite=Lax) with cross-site links, so a GET could be triggered from
// another site; a cross-site POST is sent without it.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/sortie-dechet/[id]/maj-prix-detail';
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.UPDATE`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
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
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}