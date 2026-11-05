import { NextRequest, NextResponse } from "next/server";
import { HttpStatus, httpAction } from "@/types/http";
import { create_Article, delete_Article, read_Article, update_Article } from "@/app/db-data/article";
import { localLog } from "@/components/logger/localLog";
import { Article_Type, ARTICLE_TABLE_NAME } from "@/types/article";
import { cookies } from "next/headers";
import { dbLog } from "@/lib/dbLog";
import { logError } from "@/lib/serverLog";
import { checkRole } from "@/lib/auth-lib";
import { getErrorMessage } from "@/lib/errorMessage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/article/[id]';
  if (! await checkRole(ARTICLE_TABLE_NAME+'.SHOW')) {
    const err = new Error(`Forbidden: ${ARTICLE_TABLE_NAME}.SHOW`);
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: `${pathname} GET route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article GET id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} GET route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const data = await read_Article(id)
    //consoleInfo('article/[id] GET data: ', JSON.stringify(data));
    return NextResponse.json(data);
  }
  catch (err: any) {
    logError(`${pathname} GET route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  const pathname = '/article/[id]';
  if (! await checkRole(ARTICLE_TABLE_NAME+'.ADD')) {
    const err = new Error(`Forbidden: ${ARTICLE_TABLE_NAME}.ADD`);
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Article_Type>(() => create_Article(data.data))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article created", cookieHeader, {id: data.data.code});
      await dbLog("info", "Article created", {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  const pathname = '/article/[id]';
  if (! await checkRole(ARTICLE_TABLE_NAME+'.UPDATE')) {
    const err = new Error(`Forbidden: ${ARTICLE_TABLE_NAME}.UPDATE`);
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: `${pathname} PUT route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const data = await request.json();
    const response = await httpAction<Article_Type>(() => update_Article(data.data))
    //consoleInfo('article api PUT response.ok: ', response.ok)
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article updated", cookieHeader, {id: data.data.code});
      await dbLog("info", "Article updated", {id: data.data.code});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} PUT route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pathname = '/article/[id]';
  if (! await checkRole(ARTICLE_TABLE_NAME+'.DELETE')) {
    const err = new Error(`Forbidden: ${ARTICLE_TABLE_NAME}.DELETE`);
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: `${pathname} DELETE route ${err.message}` },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }
  try {
    const prms = await params;
    const id = prms.id;
    //consoleInfo('Article DELETE id: ', id);

    if (!id) {
      return NextResponse.json(
        { error: `${pathname} DELETE route id not found` },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const response = await httpAction<Article_Type>(() => delete_Article(id))
    if (response.ok) {
      const cookieHeader = (await cookies()).toString();
      localLog("info", "Article deleted", cookieHeader, {id});
      await dbLog("info", "Article deleted", {id});
    }
    return response;
  }
  catch (err: any) {
    logError(`${pathname} DELETE route`, err);
    return NextResponse.json(
      { error: getErrorMessage(err) },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}