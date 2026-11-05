import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Versement_Dechet_Ligne, delete_Versement_Dechet_Ligne, read_Versement_Dechet_Ligne, update_Versement_Dechet_Ligne } from "@/app/db-data/versement-dechet-ligne";
import { localLog } from "@/components/logger/localLog";
import { Versement_Dechet_Ligne_Type, VERSEMENT_DECHET_LIGNE_TABLE_NAME } from "@/types/versement-dechet-ligne";
import { cookies } from "next/headers";
import { auditLog } from "@/lib/auditLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  const pathname = '/versement-dechet/[id]/ligne/[childId]';
  if (! await checkRole(VERSEMENT_DECHET_LIGNE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_LIGNE_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  const prms = await params;
  const id = prms.childId;
  //consoleInfo('Versement_Dechet_Ligne GET id: ', id);

  if (!id) {
    return NextResponse.json(
      { error: `${pathname} GET route id not found` },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

   try {
    const data = await read_Versement_Dechet_Ligne(Number(id))  
    //consoleInfo('versement_Dechet_Ligne/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  const pathname = '/versement-dechet/[id]/ligne/[childId]';
  if (! await checkRole(VERSEMENT_DECHET_LIGNE_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_LIGNE_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Ligne_Type>(() => create_Versement_Dechet_Ligne(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet_Ligne created", cookieHeader, {id: data.data.id});
      await auditLog("info", "Versement_Dechet_Ligne created", {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  const pathname = '/versement-dechet/[id]/ligne/[childId]';
  if (! await checkRole(VERSEMENT_DECHET_LIGNE_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_LIGNE_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Ligne_Type>(() => update_Versement_Dechet_Ligne(data.data))
    //consoleInfo('versement_Dechet_Ligne api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet_Ligne updated", cookieHeader, {id: data.data.id});
      await auditLog("info", "Versement_Dechet_Ligne updated", {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; childId: string }> }
) {
  const pathname = '/versement-dechet/[id]/ligne/[childId]';
  if (! await checkRole(VERSEMENT_DECHET_LIGNE_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_LIGNE_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.childId;
    //consoleInfo('Versement_Dechet_Ligne DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Versement_Dechet_Ligne_Type>(() => delete_Versement_Dechet_Ligne(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet_Ligne deleted", cookieHeader, {id});
      await auditLog("info", "Versement_Dechet_Ligne deleted", {id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}