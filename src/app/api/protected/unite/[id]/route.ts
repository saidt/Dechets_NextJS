'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Unite, delete_Unite, read_Unite, update_Unite } from "@/app/db-data/unite";
import { localLog } from "@/components/logger/localLog";
import { Unite_Type } from "@/types/unite";
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
    //consoleInfo('Unite GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "unite/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Unite(id)
    //consoleInfo('unite/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('unite/[id] GET route', err);
    return NextResponse.json(
      { error: `unite/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Unite_Type>(() => create_Unite(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite created", cookieHeader, {id: data.data.code});
      remoteLog("info", "Unite created", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('unite/[id] POST route', err);
    return NextResponse.json(
      { error: `unite/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Unite_Type>(() => update_Unite(data.data))
    //consoleInfo('unite api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite updated", cookieHeader, {id: data.data.code});
      remoteLog("info", "Unite updated", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('unite/[id] PUT route', err);
    return NextResponse.json(
      { error: `unite/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Unite DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "unite/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Unite_Type>(() => delete_Unite(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Unite deleted", cookieHeader, {id});
      remoteLog("info", "Unite deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('unite/[id] DELETE route', err);
    return NextResponse.json(
      { error: `unite/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}