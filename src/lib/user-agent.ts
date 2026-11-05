/** "Chrome 131 / Windows" from a User-Agent string (best effort, for display only). */
export function describeBrowser(userAgent: string | null | undefined): string {
  if (!userAgent) return "Inconnu";
  const version = (re: RegExp) => userAgent.match(re)?.[1];
  const browser =
    version(/Edg\/(\d+)/) ? `Edge ${version(/Edg\/(\d+)/)}` :
    version(/OPR\/(\d+)/) ? `Opera ${version(/OPR\/(\d+)/)}` :
    version(/Firefox\/(\d+)/) ? `Firefox ${version(/Firefox\/(\d+)/)}` :
    version(/Chrome\/(\d+)/) ? `Chrome ${version(/Chrome\/(\d+)/)}` :
    /Safari/.test(userAgent) && version(/Version\/(\d+)/) ? `Safari ${version(/Version\/(\d+)/)}` :
    "Navigateur inconnu";
  const os =
    /Windows/.test(userAgent) ? "Windows" :
    /Android/.test(userAgent) ? "Android" :
    /iPhone|iPad/.test(userAgent) ? "iOS" :
    /Mac OS X/.test(userAgent) ? "macOS" :
    /Linux/.test(userAgent) ? "Linux" :
    "OS inconnu";
  return `${browser} / ${os}`;
}
