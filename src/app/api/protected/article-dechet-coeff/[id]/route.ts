'use server';

import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Article_Dechet_Coeff, delete_Article_Dechet_Coeff, read_Article_Dechet_Coeff, update_Article_Dechet_Coeff } from "@/app/db-data/article-dechet-coeff";
import { localLog } from "@/components/logger/localLog";
import { Article_Dechet_Coeff_Type, ARTICLE_DECHET_COEFF_TABLE_NAME } from "@/types/article-dechet-coeff";
import { cookies } from "next/headers";
import { remoteLog } from "@/components/logger/remoteLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.SHOW`);
    logError('article-dechet-coeff/[id] GET route', err);
    return NextResponse.json(
      { error: `article-dechet-coeff/[id] route GET ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article_Dechet_Coeff GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "article_Dechet_Coeff/[id] GET id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Article_Dechet_Coeff(id)
    //consoleInfo('article_Dechet_Coeff/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError('article_Dechet_Coeff/[id] GET route', err);
    return NextResponse.json(
      { error: `article_Dechet_Coeff/[id] route GET: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.ADD`);
    logError('article-dechet-coeff/[id] POST route', err);
    return NextResponse.json(
      { error: `article-dechet-coeff/[id] route POST ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Article_Dechet_Coeff_Type>(() => create_Article_Dechet_Coeff(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article_Dechet_Coeff created", cookieHeader, {id: data.data.article_code});
      remoteLog("info", "Article_Dechet_Coeff created", cookieHeader, {id: data.data.article_code});
    }
    return response;
  }
  catch (err: any) {
    logError('article_Dechet_Coeff/[id] POST route', err);
    return NextResponse.json(
      { error: `article_Dechet_Coeff/[id] route POST: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.UPDATE`);
    logError('article-dechet-coeff/[id] PUT route', err);
    return NextResponse.json(
      { error: `article-dechet-coeff/[id] route PUT ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Article_Dechet_Coeff_Type>(() => update_Article_Dechet_Coeff(data.data))
    //consoleInfo('article_Dechet_Coeff api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article_Dechet_Coeff updated", cookieHeader, {id: data.data.article_code});
      remoteLog("info", "Article_Dechet_Coeff updated", cookieHeader, {id: data.data.article_code});
    }
    return response;
  }
  catch (err: any) {
    logError('article_Dechet_Coeff/[id] PUT route', err);
    return NextResponse.json(
      { error: `article_Dechet_Coeff/[id] route PUT: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.DELETE`);
    logError('article-dechet-coeff/[id] DELETE route', err);
    return NextResponse.json(
      { error: `article-dechet-coeff/[id] route DELETE ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article_Dechet_Coeff DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: "article_Dechet_Coeff/[id] DELETE id not found" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Article_Dechet_Coeff_Type>(() => delete_Article_Dechet_Coeff(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article_Dechet_Coeff deleted", cookieHeader, {id});
      remoteLog("info", "Article_Dechet_Coeff deleted", cookieHeader, {id});
    }
    return response;
  }
  catch (err: any) {
    logError('article_Dechet_Coeff/[id] DELETE route', err);
    return NextResponse.json(
      { error: `article_Dechet_Coeff/[id] route DELETE: ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}