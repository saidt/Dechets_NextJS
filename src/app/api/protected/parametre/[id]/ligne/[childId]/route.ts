'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Parametre_Ligne, delete_Parametre_Ligne, read_Parametre_Ligne, update_Parametre_Ligne } from "@/app/db-data/parametre-ligne";
import { localLog } from "@/components/logger/localLog";
import { Parametre_Ligne_Type } from "@/types/parametre-ligne";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  const prms = await params;
  const id = prms.childId;
  //consoleInfo('Parametre_Ligne GET id: ', id);

  if (!id) {
    return NextResponse.json(
      { error: "parametre/${id}/ligne GET id not found" },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

  try {
    const data = await read_Parametre_Ligne(Number(id))
    //consoleInfo('parametre_Ligne/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('parametre/${id}/ligne GET route', err);
    return NextResponse.json(
      { error: `parametre/${id}/ligne route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Parametre_Ligne_Type>(() => create_Parametre_Ligne(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre_Ligne created", cookieHeader, {id: data.data.id});
      remoteLog("info", "Parametre_Ligne created", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre_Ligne/[id] POST route', err);
    return NextResponse.json(
      { error: `parametre_Ligne/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Parametre_Ligne_Type>(() => update_Parametre_Ligne(data.data))
    //consoleInfo('parametre_Ligne api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre_Ligne updated", cookieHeader, {id: data.data.id});
      remoteLog("info", "Parametre_Ligne updated", cookieHeader, {id: data.data.id});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre_Ligne/[id] PUT route', err);
    return NextResponse.json(
      { error: `parametre_Ligne/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Parametre_Ligne DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "parametre_Ligne/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Parametre_Ligne_Type>(() => delete_Parametre_Ligne(Number(id)))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre_Ligne deleted", cookieHeader, {id});
      remoteLog("info", "Parametre_Ligne deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre_Ligne/[id] DELETE route', err);
    return NextResponse.json(
      { error: `parametre_Ligne/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}