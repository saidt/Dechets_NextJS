'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Client_Dechet, delete_Client_Dechet, read_Client_Dechet, update_Client_Dechet } from "@/app/db-data/client-dechet";
import { localLog } from "@/components/logger/localLog";
import { Client_Dechet_Type, CLIENT_DECHET_TABLE_NAME } from "@/types/client-dechet";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.SHOW`);
    logError('client-dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `client-dechet/[id] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "client_Dechet/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Client_Dechet(id)
    //consoleInfo('client_Dechet/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('client_Dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `client_Dechet/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.ADD`);
    logError('client-dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `client-dechet/[id] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Client_Dechet_Type>(() => create_Client_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet created", cookieHeader, {id: data.data.code});
      remoteLog("info", "Client_Dechet created", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `client_Dechet/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.UPDATE`);
    logError('client-dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `client-dechet/[id] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Client_Dechet_Type>(() => update_Client_Dechet(data.data))
    //consoleInfo('client_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet updated", cookieHeader, {id: data.data.code});
      remoteLog("info", "Client_Dechet updated", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `client_Dechet/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.DELETE`);
    logError('client-dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `client-dechet/[id] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "client_Dechet/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Client_Dechet_Type>(() => delete_Client_Dechet(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet deleted", cookieHeader, {id});
      remoteLog("info", "Client_Dechet deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `client_Dechet/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}