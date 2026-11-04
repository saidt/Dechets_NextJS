import fs from "fs";
import path from "path";
import { version as reactVersion } from "react";
import nextPkg from "next/package.json";
import appPkg from "../../package.json";

export type Versions = {
  app: string;
  next: string;
  nextAuth: string;
  react: string;
};

// next-auth does not export its package.json, so read the installed one from disk,
// falling back to the range declared in our package.json.
function installedVersion(pkgName: string, fallback: string): string {
  try {
    const file = path.join(process.cwd(), "node_modules", pkgName, "package.json");
    return JSON.parse(fs.readFileSync(file, "utf8")).version ?? fallback;
  }
  catch {
    return fallback;
  }
}

// Server only: versions are fixed for a given build, no API call needed.
export function getVersions(): Versions {
  return {
    app: appPkg.version,
    next: nextPkg.version,
    nextAuth: installedVersion("next-auth", appPkg.dependencies["next-auth"]),
    react: reactVersion,
  };
}
