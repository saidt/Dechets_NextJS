'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Envoi_Frs_Dechet, delete_Envoi_Frs_Dechet, read_Envoi_Frs_Dechet, update_Envoi_Frs_Dechet } from "@/app/db-data/envoi-frs-dechet";
import { localLog } from "@/components/logger/localLog";
import { Envoi_Frs_Dechet_Type, ENVOI_FRS_DECHET_TABLE_NAME } from "@/types/envoi-frs-dechet";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";

//import { isDevMode } from "@/lib/lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/envoi-frs-dechet/[id]';
  if (! await checkRole(ENVOI_FRS_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${ENVOI_FRS_DECHET_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //isDevMode() && console.log('Envoi_Frs_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Envoi_Frs_Dechet(Number(id))  
    //isDevMode() && console.log('envoi_Frs_Dechet/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  const pathname = '/envoi-frs-dechet/[id]';
  if (! await checkRole(ENVOI_FRS_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${ENVOI_FRS_DECHET_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => create_Envoi_Frs_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Envoi_Frs_Dechet created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  const pathname = '/envoi-frs-dechet/[id]';
  if (! await checkRole(ENVOI_FRS_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${ENVOI_FRS_DECHET_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => update_Envoi_Frs_Dechet(data.data))
    //isDevMode() && console.log('envoi_Frs_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Envoi_Frs_Dechet updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/envoi-frs-dechet/[id]';
  if (! await checkRole(ENVOI_FRS_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${ENVOI_FRS_DECHET_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //isDevMode() && console.log('Envoi_Frs_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => delete_Envoi_Frs_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet deleted", cookieHeader, {id});
      remoteLog("info", "Envoi_Frs_Dechet deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}