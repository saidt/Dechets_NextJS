import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Unite_Conversion, delete_Unite_Conversion, read_Unite_Conversion, update_Unite_Conversion } from "@/app/db-data/unite-conversion";
import { localLog } from "@/components/logger/localLog";
import { Unite_Conversion_Type, UNITE_CONVERSION_TABLE_NAME } from "@/types/unite-conversion";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/unite-conversion/[id]';
  if (! await checkRole(UNITE_CONVERSION_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${UNITE_CONVERSION_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;


    //consoleInfo('Unite_Conversion GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Unite_Conversion(Number(id))  
    //consoleInfo('unite_Conversion/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/unite-conversion/[id]';
  if (! await checkRole(UNITE_CONVERSION_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${UNITE_CONVERSION_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Unite_Conversion_Type>(() => create_Unite_Conversion(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite_Conversion created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Unite_Conversion created", cookieHeader, {id: data.data.id});
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
  const pathname = '/unite-conversion/[id]';
  if (! await checkRole(UNITE_CONVERSION_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${UNITE_CONVERSION_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Unite_Conversion_Type>(() => update_Unite_Conversion(data.data))
    //consoleInfo('unite_Conversion api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite_Conversion updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Unite_Conversion updated", cookieHeader, {id: data.data.id});
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
  const pathname = '/unite-conversion/[id]';
  if (! await checkRole(UNITE_CONVERSION_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${UNITE_CONVERSION_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Unite_Conversion DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Unite_Conversion_Type>(() => delete_Unite_Conversion(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite_Conversion deleted", cookieHeader, {id});
      remoteLog("info", "Unite_Conversion deleted", cookieHeader, {id});
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