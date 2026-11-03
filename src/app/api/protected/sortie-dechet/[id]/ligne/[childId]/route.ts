'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Sortie_Dechet_Ligne, delete_Sortie_Dechet_Ligne, read_Sortie_Dechet_Ligne, update_Sortie_Dechet_Ligne } from "@/app/db-data/sortie-dechet-ligne";
import { localLog } from "@/components/logger/localLog";
import { Sortie_Dechet_Ligne_Type } from "@/types/sortie-dechet-ligne";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
//import { consoleInfo } from "@/lib/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  const prms = await params;
  const id = prms.childId;
  //consoleInfo('Sortie_Dechet_Ligne GET id: ', id);

  if (!id) {
    return NextResponse.json(
      { error: "sortie_Dechet_Ligne/[id] GET id not found" },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

  try {
    const data = await read_Sortie_Dechet_Ligne(Number(id))
    //consoleInfo('sortie_Dechet_Ligne/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('sortie_Dechet_Ligne/[id] GET route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Ligne/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Ligne_Type>(() => create_Sortie_Dechet_Ligne(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Ligne created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Sortie_Dechet_Ligne created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Ligne/[id] POST route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Ligne/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Sortie_Dechet_Ligne_Type>(() => update_Sortie_Dechet_Ligne(data.data))
    //consoleInfo('sortie_Dechet_Ligne api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Ligne updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Sortie_Dechet_Ligne updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Ligne/[id] PUT route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Ligne/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Sortie_Dechet_Ligne DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "sortie_Dechet_Ligne/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Sortie_Dechet_Ligne_Type>(() => delete_Sortie_Dechet_Ligne(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Sortie_Dechet_Ligne deleted", cookieHeader, {id});
      remoteLog("info", "Sortie_Dechet_Ligne deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('sortie_Dechet_Ligne/[id] DELETE route', err);
    return NextResponse.json(
      { error: `sortie_Dechet_Ligne/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}