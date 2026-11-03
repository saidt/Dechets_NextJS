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
  const pathname = '/client-dechet-sld-ini/[id]';
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //consoleInfo('Client_Dechet_Sld_Ini GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Client_Dechet_Sld_Ini(Number(id))  
    //consoleInfo('client_Dechet_Sld_Ini/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/client-dechet-sld-ini/[id]';
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
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
  const pathname = '/client-dechet-sld-ini/[id]';
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
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
  const pathname = '/client-dechet-sld-ini/[id]';
  if (! await checkRole(CLIENT_DECHET_SLD_INI_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_SLD_INI_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet_Sld_Ini DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
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
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}