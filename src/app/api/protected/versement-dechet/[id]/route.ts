import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Versement_Dechet, delete_Versement_Dechet, read_Versement_Dechet, update_Versement_Dechet } from "@/app/db-data/versement-dechet";
import { localLog } from "@/components/logger/localLog";
import { Versement_Dechet_Type, VERSEMENT_DECHET_TABLE_NAME } from "@/types/versement-dechet";
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
  const pathname = '/versement-dechet/[id]';
  if (! await checkRole(VERSEMENT_DECHET_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //consoleInfo('Versement_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Versement_Dechet(Number(id))  
    //consoleInfo('versement_Dechet/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/versement-dechet/[id]';
  if (! await checkRole(VERSEMENT_DECHET_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Type>(() => create_Versement_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet created", cookieHeader, {id: data.data.numero});
      await auditLog("info", "Versement_Dechet created", {id: data.data.numero});
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
  const pathname = '/versement-dechet/[id]';
  if (! await checkRole(VERSEMENT_DECHET_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Type>(() => update_Versement_Dechet(data.data))
    //consoleInfo('versement_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet updated", cookieHeader, {id: data.data.numero});
      await auditLog("info", "Versement_Dechet updated", {id: data.data.numero});
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
  const pathname = '/versement-dechet/[id]';
  if (! await checkRole(VERSEMENT_DECHET_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${VERSEMENT_DECHET_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Versement_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Versement_Dechet_Type>(() => delete_Versement_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet deleted", cookieHeader, {id});
      await auditLog("info", "Versement_Dechet deleted", {id});
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