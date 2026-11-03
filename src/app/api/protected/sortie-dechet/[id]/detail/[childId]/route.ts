'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Sortie_Dechet_Detail, delete_Sortie_Dechet_Detail, read_Sortie_Dechet_Detail, update_Sortie_Dechet_Detail } from "@/app/db-data/sortie-dechet-detail";
import { localLog } from "@/components/logger/localLog";
import { Sortie_Dechet_Detail_Type, SORTIE_DECHET_DETAIL_TABLE_NAME } from "@/types/sortie-dechet-detail";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  if (! await checkRole(SORTIE_DECHET_DETAIL_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_DETAIL_TABLE_NAME}.SHOW`);
    logError('sortie-dechet/[id]/detail/[childId] GET route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id]/detail/[childId] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  const prms = await params;
  const id = prms.childId;
  //consoleInfo('Sortie_Dechet_Detail GET id: ', id);

  if (!id) {
    return NextResponse.json(
      { error: "sortie_Dechet_Detail/[id] GET id not found" },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

  try {
    const data = await read_Sortie_Dechet_Detail(Number(id))
    //consoleInfo('sortie_Dechet_Detail/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('sortie_Dechet_Detail/[id] GET route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Detail/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(SORTIE_DECHET_DETAIL_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_DETAIL_TABLE_NAME}.ADD`);
    logError('sortie-dechet/[id]/detail/[childId] POST route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id]/detail/[childId] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Detail_Type>(() => create_Sortie_Dechet_Detail(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Detail created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Sortie_Dechet_Detail created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Detail/[id] POST route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Detail/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(SORTIE_DECHET_DETAIL_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_DETAIL_TABLE_NAME}.UPDATE`);
    logError('sortie-dechet/[id]/detail/[childId] PUT route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id]/detail/[childId] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Detail_Type>(() => update_Sortie_Dechet_Detail(data.data))
    //consoleInfo('sortie_Dechet_Detail api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Detail updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Sortie_Dechet_Detail updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Detail/[id] PUT route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Detail/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(SORTIE_DECHET_DETAIL_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${SORTIE_DECHET_DETAIL_TABLE_NAME}.DELETE`);
    logError('sortie-dechet/[id]/detail/[childId] DELETE route', err);
    return NextResponse.json(
      { error: `sortie-dechet/[id]/detail/[childId] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Sortie_Dechet_Detail DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "sortie_Dechet_Detail/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Sortie_Dechet_Detail_Type>(() => delete_Sortie_Dechet_Detail(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Detail deleted", cookieHeader, {id});
      remoteLog("info", "Sortie_Dechet_Detail deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Detail/[id] DELETE route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Detail/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}