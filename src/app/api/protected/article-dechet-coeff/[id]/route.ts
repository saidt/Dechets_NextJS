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
  const pathname = '/article-dechet-coeff/[id]';
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article_Dechet_Coeff GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Article_Dechet_Coeff(id)
    //consoleInfo('article_Dechet_Coeff/[id] GET data: ', JSON.stringify(data));
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
  const pathname = '/article-dechet-coeff/[id]';
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
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
  const pathname = '/article-dechet-coeff/[id]';
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
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
  const pathname = '/article-dechet-coeff/[id]';
  if (! await checkRole(ARTICLE_DECHET_COEFF_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${ARTICLE_DECHET_COEFF_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article_Dechet_Coeff DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
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
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${String(err)}` },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}