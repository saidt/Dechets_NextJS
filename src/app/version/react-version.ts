'use server'

import { logError } from "@/lib/serverLog";
import pkg from "../../../package.json";

export async function reactVersion() {
  try {
    return pkg.dependencies.react;
  } 
  catch (err: any) {
    logError('reactVersion', err);
    throw err;
  }
}