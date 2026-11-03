'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Retour_Dechet_Ligne, delete_Retour_Dechet_Ligne, read_Retour_Dechet_Ligne, update_Retour_Dechet_Ligne } from "@/app/db-data/retour-dechet-ligne";
import { localLog } from "@/components/logger/localLog";
import { Retour_Dechet_Ligne_Type, RETOUR_DECHET_LIGNE_TABLE_NAME } from "@/types/retour-dechet-ligne";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  if (! await checkRole(RETOUR_DECHET_LIGNE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_LIGNE_TABLE_NAME}.SHOW`);
    logError('retour-dechet/[id]/ligne/[childId] GET route', err);
    return NextResponse.json(
      { error: `retour-dechet/[id]/ligne/[childId] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  const prms = await params;
  const id = prms.childId;
  //consoleInfo('Retour_Dechet_Ligne GET id: ', id);

  if (!id) {
    return NextResponse.json(
      { error: "retour_Dechet_Ligne/[id] GET id not found" },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

  try {
    const data = await read_Retour_Dechet_Ligne(Number(id))
    //consoleInfo('retour_Dechet_Ligne/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('retour_Dechet_Ligne/[id] GET route', err);
    return NextResponse.json(
      { error: `retour_Dechet_Ligne/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(RETOUR_DECHET_LIGNE_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_LIGNE_TABLE_NAME}.ADD`);
    logError('retour-dechet/[id]/ligne/[childId] POST route', err);
    return NextResponse.json(
      { error: `retour-dechet/[id]/ligne/[childId] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Retour_Dechet_Ligne_Type>(() => create_Retour_Dechet_Ligne(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Retour_Dechet_Ligne created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Retour_Dechet_Ligne created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('retour_Dechet_Ligne/[id] POST route', err);
    return NextResponse.json(
      { error: `retour_Dechet_Ligne/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(RETOUR_DECHET_LIGNE_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_LIGNE_TABLE_NAME}.UPDATE`);
    logError('retour-dechet/[id]/ligne/[childId] PUT route', err);
    return NextResponse.json(
      { error: `retour-dechet/[id]/ligne/[childId] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Retour_Dechet_Ligne_Type>(() => update_Retour_Dechet_Ligne(data.data))
    //consoleInfo('retour_Dechet_Ligne api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Retour_Dechet_Ligne updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Retour_Dechet_Ligne updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('retour_Dechet_Ligne/[id] PUT route', err);
    return NextResponse.json(
      { error: `retour_Dechet_Ligne/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(RETOUR_DECHET_LIGNE_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${RETOUR_DECHET_LIGNE_TABLE_NAME}.DELETE`);
    logError('retour-dechet/[id]/ligne/[childId] DELETE route', err);
    return NextResponse.json(
      { error: `retour-dechet/[id]/ligne/[childId] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Retour_Dechet_Ligne DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "retour_Dechet_Ligne/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Retour_Dechet_Ligne_Type>(() => delete_Retour_Dechet_Ligne(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Retour_Dechet_Ligne deleted", cookieHeader, {id});
      remoteLog("info", "Retour_Dechet_Ligne deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('retour_Dechet_Ligne/[id] DELETE route', err);
    return NextResponse.json(
      { error: `retour_Dechet_Ligne/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}