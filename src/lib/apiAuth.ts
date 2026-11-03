import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exists_User_Role } from "@/app/db-data/user-role";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";

/**
 * Checks that the current user has the given role (e.g. `dbo.SORTIE_DECHET.UPDATE`).
 * Returns null if access is granted, otherwise a 401 response to return as-is.
 *
 *   const denied = await checkRole(`${SORTIE_DECHET_TABLE_NAME}.UPDATE`);
 *   if (denied) return denied;
 */
export async function checkRole(roleId: string): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = roleId.trim().toUpperCase();

  if (userId && (await exists_User_Role(userId, role))) {
    return null;
  }

  const err = new Error(`User ${userId ?? "(no session)"} does not have ${role} role !`);
  logError("checkRole", err);
  return NextResponse.json({ error: String(err) }, { status: HttpStatus.UNAUTHORIZED });
}
