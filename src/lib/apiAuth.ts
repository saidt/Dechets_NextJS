import { NextRequest, NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HttpStatus } from "@/types/http";
import { logError } from "@/lib/serverLog";

/**
 * Server-side role checks for API route handlers.
 *
 * Role ids follow the convention already used by the UI (AuthContext.hasRole):
 *   `<TABLE_NAME>.<PRIVILEGE>`  e.g. `dbo.SORTIE_DECHET.UPDATE`
 */

export type Privilege =
  | "LIST" | "SHOW" | "ADD" | "UPDATE" | "DELETE" | "PRINT" | "EXPORT" | "EXEC";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** A Next.js route handler, plus the session we already resolved. */
export type AuthedHandler<C> = (
  req: NextRequest,
  ctx: C,
  session: Session,
) => Promise<Response> | Response;

type RouteHandler<C> = (req: NextRequest, ctx: C) => Promise<Response>;

export class ApiAuthError extends Error {
  constructor(public status: HttpStatus, message: string) {
    super(message);
  }
}

export const roleId = (table: string, privilege: Privilege) =>
  `${table}.${privilege}`.trim().toUpperCase();

/** Returns the session, or throws 401. */
export async function requireSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new ApiAuthError(HttpStatus.UNAUTHORIZED, "Session not found");
  }
  return session;
}

/** True if the user owns at least one of the given roles (single DB query). */
export async function userHasAnyRole(userId: string, roles: string[]): Promise<boolean> {
  const count = await prisma.user_Role.count({
    where: {
      user_id: userId,
      role_id: { in: roles.map((r) => r.trim().toUpperCase()) },
    },
  });
  return count > 0;
}

/** Returns the session, or throws 401 (no session) / 403 (missing role). */
export async function requireRole(roles: string | string[]): Promise<Session> {
  const session = await requireSession();
  const list = Array.isArray(roles) ? roles : [roles];
  if (!(await userHasAnyRole(session.user.id, list))) {
    throw new ApiAuthError(
      HttpStatus.FORBIDDEN,
      `User ${session.user.id} does not have role ${list.join(" | ")}`,
    );
  }
  return session;
}

function authErrorResponse(err: unknown, where: string): Response {
  if (err instanceof ApiAuthError) {
    logError(where, err);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  throw err; // not ours: let the handler's own try/catch / Next handle it
}

/** Wrap a handler: session required, no specific role. */
export function withAuth<C = unknown>(handler: AuthedHandler<C>): RouteHandler<C> {
  return async (req, ctx) => {
    let session: Session;
    try {
      session = await requireSession();
    } catch (err) {
      return authErrorResponse(err, `withAuth ${req.method} ${req.nextUrl.pathname}`);
    }
    return handler(req, ctx, session);
  };
}

/**
 * Wrap a handler with a role check.
 * `roles` may be a fixed role id, a list (any of), or a function of the request
 * (e.g. for sp/exec where the role depends on a query param).
 */
export function withRole<C = unknown>(
  roles: string | string[] | ((req: NextRequest, ctx: C) => string | string[] | Promise<string | string[]>),
  handler: AuthedHandler<C>,
): RouteHandler<C> {
  return async (req, ctx) => {
    let session: Session;
    try {
      const required = typeof roles === "function" ? await roles(req, ctx) : roles;
      session = await requireRole(required);
    } catch (err) {
      return authErrorResponse(err, `withRole ${req.method} ${req.nextUrl.pathname}`);
    }
    return handler(req, ctx, session);
  };
}

/** Shortcut: `withPrivilege(SORTIE_DECHET_TABLE_NAME, "UPDATE", handler)`. */
export function withPrivilege<C = unknown>(
  table: string,
  privilege: Privilege | Privilege[],
  handler: AuthedHandler<C>,
): RouteHandler<C> {
  const privileges = Array.isArray(privilege) ? privilege : [privilege];
  return withRole<C>(privileges.map((p) => roleId(table, p)), handler);
}

/**
 * Fully generic: derive the privilege from the HTTP method.
 *
 *   kind "list" (collection route, e.g. /sortie-dechet)      GET -> LIST
 *   kind "item" (single record, e.g. /sortie-dechet/[id])     GET -> SHOW
 *   POST -> ADD, PUT/PATCH -> UPDATE, DELETE -> DELETE
 *
 * Usage in a route.ts:
 *   export const { GET, PUT, DELETE } = protectTable(TABLE, "item", { GET: ..., PUT: ..., DELETE: ... })
 */
export function protectTable<C = any, M extends Partial<Record<HttpMethod, AuthedHandler<C>>> = {}>(
  table: string,
  kind: "list" | "item",
  handlers: M,
  overrides: Partial<Record<HttpMethod, Privilege | Privilege[]>> = {},
): { [K in keyof M]: RouteHandler<C> } {
  const defaults: Record<HttpMethod, Privilege> = {
    GET: kind === "list" ? "LIST" : "SHOW",
    POST: "ADD",
    PUT: "UPDATE",
    PATCH: "UPDATE",
    DELETE: "DELETE",
  };
  const out: Partial<Record<HttpMethod, RouteHandler<C>>> = {};
  for (const method of Object.keys(handlers) as HttpMethod[]) {
    const handler = handlers[method] as AuthedHandler<C>;
    out[method] = withPrivilege<C>(table, overrides[method] ?? defaults[method], handler);
  }
  return out as { [K in keyof M]: RouteHandler<C> };
}

/** For /user/[id]/...: allow the user themself, or anyone holding one of `adminRoles`. */
export function withSelfOrRole<C extends { params: Promise<{ id: string }> }>(
  adminRoles: string | string[],
  handler: AuthedHandler<C>,
): RouteHandler<C> {
  return async (req, ctx) => {
    let session: Session;
    try {
      session = await requireSession();
      const { id } = await ctx.params;
      if (id !== session.user.id) {
        await requireRole(adminRoles);
      }
    } catch (err) {
      return authErrorResponse(err, `withSelfOrRole ${req.method} ${req.nextUrl.pathname}`);
    }
    return handler(req, ctx, session);
  };
}
