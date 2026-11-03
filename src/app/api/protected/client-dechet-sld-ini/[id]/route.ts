'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Client_Dechet_Sld_Ini, delete_Client_Dechet_Sld_Ini, read_Client_Dechet_Sld_Ini, update_Client_Dechet_Sld_Ini } from "@/app/db-data/client-dechet-sld-ini";
import { localLog } from "@/components/logger/localLog";
import { Client_Dechet_Sld_Ini_Type } from "@/types/client-dechet-sld-ini";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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