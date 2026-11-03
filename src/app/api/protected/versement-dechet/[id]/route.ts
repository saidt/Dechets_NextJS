'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Versement_Dechet, delete_Versement_Dechet, read_Versement_Dechet, update_Versement_Dechet } from "@/app/db-data/versement-dechet";
import { localLog } from "@/components/logger/localLog";
import { Versement_Dechet_Type } from "@/types/versement-dechet";
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


    //consoleInfo('Versement_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "versement_Dechet/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Versement_Dechet(Number(id))  
    //consoleInfo('versement_Dechet/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('versement_Dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `versement_Dechet/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Type>(() => create_Versement_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet created", cookieHeader, {id: data.data.numero});
      remoteLog("info", "Versement_Dechet created", cookieHeader, {id: data.data.numero});
    }
    return response;
  }
  catch (err: any) {
    logError('versement_Dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `versement_Dechet/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Versement_Dechet_Type>(() => update_Versement_Dechet(data.data))
    //consoleInfo('versement_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet updated", cookieHeader, {id: data.data.numero});
      remoteLog("info", "Versement_Dechet updated", cookieHeader, {id: data.data.numero});
    }
    return response;
  }
  catch (err: any) {
    logError('versement_Dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `versement_Dechet/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Versement_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "versement_Dechet/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Versement_Dechet_Type>(() => delete_Versement_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Versement_Dechet deleted", cookieHeader, {id});
      remoteLog("info", "Versement_Dechet deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('versement_Dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `versement_Dechet/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}