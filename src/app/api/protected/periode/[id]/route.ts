import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Periode, delete_Periode, read_Periode, update_Periode } from "@/app/db-data/periode";
import { localLog } from "@/components/logger/localLog";
import { Periode_Type, PERIODE_TABLE_NAME } from "@/types/periode";
import { cookies } from "next/headers";
import { dbLog } from "@/lib/dbLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/periode/[id]';
  if (! await checkRole(PERIODE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Periode GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Periode(id)
    //consoleInfo('periode/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/periode/[id]';
  if (! await checkRole(PERIODE_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Periode_Type>(() => create_Periode(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Periode created", cookieHeader, {id: data.data.code});
      await dbLog("info", "Periode created", {id: data.data.code});
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
  const pathname = '/periode/[id]';
  if (! await checkRole(PERIODE_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
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
      await dbLog("info", "Periode updated", {id: data.data.code});
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
  const pathname = '/periode/[id]';
  if (! await checkRole(PERIODE_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${PERIODE_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Periode DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Periode_Type>(() => delete_Periode(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Periode deleted", cookieHeader, {id});
      await dbLog("info", "Periode deleted", {id});
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