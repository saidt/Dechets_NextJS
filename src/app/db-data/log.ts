import { consoleInfo } from "@/lib/clientLog";
import { prisma } from "@/lib/prisma";
import { LogType } from "@/types/log";

export async function createLog(log: LogType) : Promise<LogType> {
  consoleInfo('createLog log: ', log);
  const { id, ...logData } : LogType = log;
  
  const inserted = await prisma.log.create({
    data: logData
  });
  return JSON.parse(JSON.stringify(inserted));
}