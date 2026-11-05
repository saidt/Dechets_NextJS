import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Reglement_Dechet, delete_Reglement_Dechet, read_Reglement_Dechet, update_Reglement_Dechet } from "@/app/db-data/reglement-dechet";
import { localLog } from "@/components/logger/localLog";
import { Reglement_Dechet_Type, REGLEMENT_DECHET_TABLE_NAME } from "@/types/reglement-dechet";
import { cookies } from "next/headers";
import { auditLog } from "@/lib/auditLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/reglement-dechet/[id]';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Reglement_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Reglement_Dechet(Number(id))
    //consoleInfo('reglement_Dechet/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/reglement-dechet/[id]';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Reglement_Dechet_Type>(() => create_Reglement_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Reglement_Dechet created", cookieHeader, {id: data.data.numero});
      await auditLog("info", "Reglement_Dechet created", {id: data.data.numero});
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
  const pathname = '/reglement-dechet/[id]';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Reglement_Dechet_Type>(() => update_Reglement_Dechet(data.data))
    //consoleInfo('reglement_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Reglement_Dechet updated", cookieHeader, {id: data.data.numero});
      await auditLog("info", "Reglement_Dechet updated", {id: data.data.numero});
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
  const pathname = '/reglement-dechet/[id]';
  if (! await checkRole(REGLEMENT_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${REGLEMENT_DECHET_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Reglement_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Reglement_Dechet_Type>(() => delete_Reglement_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Reglement_Dechet deleted", cookieHeader, {id});
      await auditLog("info", "Reglement_Dechet deleted", {id});
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