'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Envoi_Frs_Dechet, delete_Envoi_Frs_Dechet, read_Envoi_Frs_Dechet, update_Envoi_Frs_Dechet } from "@/app/db-data/envoi-frs-dechet";
import { localLog } from "@/components/logger/localLog";
import { Envoi_Frs_Dechet_Type } from "@/types/envoi-frs-dechet";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";

//import { isDevMode } from "@/lib/lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prms = await params;
    const id = prms.id;


    //isDevMode() && console.log('Envoi_Frs_Dechet GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "envoi_Frs_Dechet/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Envoi_Frs_Dechet(Number(id))  
    //isDevMode() && console.log('envoi_Frs_Dechet/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('envoi_Frs_Dechet/[id] GET route', err);
    return NextResponse.json(
      { error: `envoi_Frs_Dechet/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => create_Envoi_Frs_Dechet(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Envoi_Frs_Dechet created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('envoi_Frs_Dechet/[id] POST route', err);
    return NextResponse.json(
      { error: `envoi_Frs_Dechet/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => update_Envoi_Frs_Dechet(data.data))
    //isDevMode() && console.log('envoi_Frs_Dechet api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Envoi_Frs_Dechet updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('envoi_Frs_Dechet/[id] PUT route', err);
    return NextResponse.json(
      { error: `envoi_Frs_Dechet/[id] route PUT: ${String(err)}` },
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
    //isDevMode() && console.log('Envoi_Frs_Dechet DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "envoi_Frs_Dechet/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Envoi_Frs_Dechet_Type>(() => delete_Envoi_Frs_Dechet(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Envoi_Frs_Dechet deleted", cookieHeader, {id});
      remoteLog("info", "Envoi_Frs_Dechet deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('envoi_Frs_Dechet/[id] DELETE route', err);
    return NextResponse.json(
      { error: `envoi_Frs_Dechet/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}