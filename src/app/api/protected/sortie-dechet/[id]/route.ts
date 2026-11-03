'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Sortie_Dechet, delete_Sortie_Dechet, read_Sortie_Dechet, update_Sortie_Dechet } from "@/app/db-data/sortie-dechet";
import { localLog } from "@/components/logger/localLog";
import { Sortie_Dechet_Type, SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.SHOW`);
    logError('sortie-dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Sortie_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "sortie_Dechet/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Sortie_Dechet(Number(id))
    //consoleInfo('sortie_Dechet/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('sortie_Dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `sortie_Dechet/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.ADD`);
    logError('sortie-dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Type>(() => create_Sortie_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet created", cookieHeader, {id: data.data.numero});
      remoteLog("info", "Sortie_Dechet created", cookieHeader, {id: data.data.numero});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `sortie_Dechet/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.UPDATE`);
    logError('sortie-dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Type>(() => update_Sortie_Dechet(data.data))
    //consoleInfo('sortie_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet updated", cookieHeader, {id: data.data.numero});
      remoteLog("info", "Sortie_Dechet updated", cookieHeader, {id: data.data.numero});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `sortie_Dechet/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(SORTIE_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_TABLE_NAME}.DELETE`);
    logError('sortie-dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Sortie_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "sortie_Dechet/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Sortie_Dechet_Type>(() => delete_Sortie_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet deleted", cookieHeader, {id});
      remoteLog("info", "Sortie_Dechet deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `sortie_Dechet/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}