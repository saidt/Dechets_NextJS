'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Article, delete_Article, read_Article, update_Article } from "@/app/db-data/article";
import { localLog } from "@/components/logger/localLog";
import { Article_Type } from "@/types/article";
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
    //consoleInfo('Article GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "article/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Article(id)
    //consoleInfo('article/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('article/[id] GET route', err);
    return NextResponse.json(
      { error: `article/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Article_Type>(() => create_Article(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article created", cookieHeader, {id: data.data.code});
      remoteLog("info", "Article created", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('article/[id] POST route', err);
    return NextResponse.json(
      { error: `article/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const data = await request.json();
    const response = await httpAction<Article_Type>(() => update_Article(data.data))
    //consoleInfo('article api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article updated", cookieHeader, {id: data.data.code});
      remoteLog("info", "Article updated", cookieHeader, {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError('article/[id] PUT route', err);
    return NextResponse.json(
      { error: `article/[id] route PUT: ${String(err)}` },
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
    //consoleInfo('Article DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "article/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Article_Type>(() => delete_Article(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article deleted", cookieHeader, {id});
      remoteLog("info", "Article deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('article/[id] DELETE route', err);
    return NextResponse.json(
      { error: `article/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}