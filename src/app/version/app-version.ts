'use server'

import { logError } from "@/lib/serverLog";
import pkg from "../../../package.json";

export async function appVersion() {
  try {
    return pkg.version;
  } 
  catch (err: any) {
    logError('appVersion', err);
    throw err;
  }
}