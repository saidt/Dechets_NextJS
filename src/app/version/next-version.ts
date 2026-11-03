'use server'

import { logError } from "@/lib/serverLog";
import pkg from "../../../package.json";

export async function nextVersion() {
  try {
    return pkg.dependencies.next;
  } 
  catch (err: any) {
    logError('nextVersion', err);
    throw err;
  }
}