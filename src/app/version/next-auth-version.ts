'use server'

import { logError } from "@/lib/serverLog";
import pkg from "../../../package.json";

export async function nextAuthVersion() {
  try {
    return pkg.dependencies['next-auth'];
  } 
  catch (err: any) {
    logError('nextAuthVersion', err);
    throw err;
  }
}