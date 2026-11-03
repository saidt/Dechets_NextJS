'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Client_Dechet_Sld_Ini, delete_Client_Dechet_Sld_Ini, read_Client_Dechet_Sld_Ini, update_Client_Dechet_Sld_Ini } from "@/app/db-data/client-dechet-sld-ini";
import { localLog } from "@/components/logger/localLog";
import { Client_Dechet_Sld_Ini_Type, CLIENT_DECHET_SLD_INI_TABLE_NAME } from "@/types/client-dechet-sld-ini";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.SHOW`);
    logError('client-dechet-sld-ini/[id] GET route', err);
    return NextResponse.json(
      { error: `client-dechet-sld-ini/[id] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //consoleInfo('Client_Dechet_Sld_Ini GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "client_Dechet_Sld_Ini/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Client_Dechet_Sld_Ini(Number(id))  
    //consoleInfo('client_Dechet_Sld_Ini/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('client_Dechet_Sld_Ini/[id] GET route', err);
    return NextResponse.json(
      { error: `client_Dechet_Sld_Ini/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.ADD`);
    logError('client-dechet-sld-ini/[id] POST route', err);
    return NextResponse.json(
      { error: `client-dechet-sld-ini/[id] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Client_Dechet_Sld_Ini_Type>(() => create_Client_Dechet_Sld_Ini(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet_Sld_Ini created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Client_Dechet_Sld_Ini created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet_Sld_Ini/[id] POST route', err);
    return NextResponse.json(
      { error: `client_Dechet_Sld_Ini/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.UPDATE`);
    logError('client-dechet-sld-ini/[id] PUT route', err);
    return NextResponse.json(
      { error: `client-dechet-sld-ini/[id] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Client_Dechet_Sld_Ini_Type>(() => update_Client_Dechet_Sld_Ini(data.data))
    //consoleInfo('client_Dechet_Sld_Ini api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet_Sld_Ini updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Client_Dechet_Sld_Ini updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet_Sld_Ini/[id] PUT route', err);
    return NextResponse.json(
      { error: `client_Dechet_Sld_Ini/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.DELETE`);
    logError('client-dechet-sld-ini/[id] DELETE route', err);
    return NextResponse.json(
      { error: `client-dechet-sld-ini/[id] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet_Sld_Ini DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "client_Dechet_Sld_Ini/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Client_Dechet_Sld_Ini_Type>(() => delete_Client_Dechet_Sld_Ini(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet_Sld_Ini deleted", cookieHeader, {id});
      remoteLog("info", "Client_Dechet_Sld_Ini deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('client_Dechet_Sld_Ini/[id] DELETE route', err);
    return NextResponse.json(
      { error: `client_Dechet_Sld_Ini/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}