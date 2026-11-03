import { consoleError } from "@/lib/clientLog";
import { LogLevel } from "@/types/log";

export async function remoteLog(
  level: LogLevel,
  message: string,
  cookieHeader: string,
  context?: Record<string, unknown>
) {

  try {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/protected/remote-log`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      credentials: 'include',
      body: JSON.stringify({ level, message, context }),
    });
  }
  catch {
    // never throw from logging
    consoleError('localLog fetch api error !')
  }
}