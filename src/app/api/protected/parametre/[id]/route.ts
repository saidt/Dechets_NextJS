'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Parametre, delete_Parametre, read_Parametre, update_Parametre } from "@/app/db-data/parametre";
import { localLog } from "@/components/logger/localLog";
import { Parametre_Type } from "@/types/parametre";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Parametre GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "parametre/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Parametre(id)
    //consoleInfo('parametre/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('parametre/[id] GET route', err);
    return NextResponse.json(
      { error: `parametre/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Parametre_Type>(() => create_Parametre(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre created", cookieHeader, {id: data.data.rubrique});
      remoteLog("info", "Parametre created", cookieHeader, {id: data.data.rubrique});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre/[id] POST route', err);
    return NextResponse.json(
      { error: `parametre/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Parametre_Type>(() => update_Parametre(data.data))
    //consoleInfo('parametre api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre updated", cookieHeader, {id: data.data.rubrique});
      remoteLog("info", "Parametre updated", cookieHeader, {id: data.data.rubrique});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre/[id] PUT route', err);
    return NextResponse.json(
      { error: `parametre/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Parametre DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "parametre/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Parametre_Type>(() => delete_Parametre(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Parametre deleted", cookieHeader, {id});
      remoteLog("info", "Parametre deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('parametre/[id] DELETE route', err);
    return NextResponse.json(
      { error: `parametre/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}