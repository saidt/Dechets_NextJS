import { createLog } from "@/app/db-data/log";
import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/serverLog";
import { HttpStatus } from "@/types/http";
import { LogType } from "@/types/log";
import { getServerSession } from 'next-auth';
//import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const pathname = '/remote-log';
  try {
    const body = await req.json();

    const {
      level = "info",
      message,
      context,
    } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: `${pathname} POST route message is required` }),
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    //const cooks = await cookies()
    //consoleInfo("Api remote log  cookies:", JSON.stringify(cooks.getAll()));

    const session = await getServerSession(authOptions);
    const userId = session?.user.id
    //consoleInfo('Api remote log session: ', session)
    const log : LogType = {
      id: 0,
      date_oper: new Date(),
      user_id: userId,
      severite: level,
      message,
      contexte: JSON.stringify(context)
    }
    //const data = await createLog(log)
    await createLog(log)
    //consoleInfo('Api remote log data: ', JSON.stringify(data));

    return NextResponse.json({ ok: true });
  }
  catch (err) {
    logError(`${pathname} POST route`, err);
    return NextResponse.json(
      { error: `${pathname} POST route ${String(err)}` },
      { status: HttpStatus.BAD_REQUEST }
    );
  }
}