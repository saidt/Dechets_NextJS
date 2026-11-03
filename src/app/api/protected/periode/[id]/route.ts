'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Periode, delete_Periode, read_Periode, update_Periode } from "@/app/db-data/periode";
import { localLog } from "@/components/logger/localLog";
import { Periode_Type, PERIODE_TABLE_NAME } from "@/types/periode";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(PERIODE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.SHOW`);
    logError('periode/[id] GET route', err);
    return NextResponse.json(
      { error: `periode/[id] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Periode GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "periode/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Periode(id)
    //consoleInfo('periode/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('periode/[id] GET route', err);
    return NextResponse.json(
      { error: `periode/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(PERIODE_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.ADD`);
    logError('periode/[id] POST route', err);
    return NextResponse.json(
      { error: `periode/[id] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Periode_Type>(() => create_Periode(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Periode created", cookieHeader, {id: data.data.code});
      remoteLog("info", "Periode created", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('periode/[id] POST route', err);
    return NextResponse.json(
      { error: `periode/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(PERIODE_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.UPDATE`);
    logError('periode/[id] PUT route', err);
    return NextResponse.json(
      { error: `periode/[id] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Periode_Type>(() => update_Periode(data.data))
    //consoleInfo('periode api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Periode updated", cookieHeader, {id: data.data.code});
      remoteLog("info", "Periode updated", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('periode/[id] PUT route', err);
    return NextResponse.json(
      { error: `periode/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(PERIODE_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.DELETE`);
    logError('periode/[id] DELETE route', err);
    return NextResponse.json(
      { error: `periode/[id] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Periode DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "periode/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Periode_Type>(() => delete_Periode(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Periode deleted", cookieHeader, {id});
      remoteLog("info", "Periode deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('periode/[id] DELETE route', err);
    return NextResponse.json(
      { error: `periode/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}