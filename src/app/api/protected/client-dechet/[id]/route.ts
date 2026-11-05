import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Client_Dechet, delete_Client_Dechet, read_Client_Dechet, update_Client_Dechet } from "@/app/db-data/client-dechet";
import { localLog } from "@/components/logger/localLog";
import { Client_Dechet_Type, CLIENT_DECHET_TABLE_NAME } from "@/types/client-dechet";
import { cookies } from "next/headers";
import { dbLog } from "@/lib/dbLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/client-dechet/[id]';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Client_Dechet(id)
    //consoleInfo('client_Dechet/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/client-dechet/[id]';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Client_Dechet_Type>(() => create_Client_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet created", cookieHeader, {id: data.data.code});
      await dbLog("info", "Client_Dechet created", {id: data.data.code});
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
  const pathname = '/client-dechet/[id]';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
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
      await dbLog("info", "Client_Dechet updated", {id: data.data.code});
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
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/client-dechet/[id]';
  if (! await checkRole(CLIENT_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${CLIENT_DECHET_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Client_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Client_Dechet_Type>(() => delete_Client_Dechet(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Client_Dechet deleted", cookieHeader, {id});
      await dbLog("info", "Client_Dechet deleted", {id});
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