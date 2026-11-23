# Changes since "Copy from current state" (57fbb37)

61 commits, 2026-11-03 → 2026-11-05. About 230 files changed.

## 1. Authentication and passwords
- **Passwords hashed with bcrypt** (cost 12), peppered with `NEXTAUTH_SECRET`, replacing the plain unsalted SHA-256 (`src/lib/crypt.ts`: `hashPassword`, `verifyPassword`, `isBcryptHash`).
- **Login checks the password directly** in NextAuth's `authorize()`. The public `/api/auth/login` route is deleted.
- **Lockout** after 5 failed logins within 15 minutes, per user ID (`LOGIN_MAX_FAILURES`, `LOGIN_LOCK_MINUTES` in `src/lib/consts.ts`), based on the `LOG` table.
- **Failed and blocked logins** are written to `LOG` ("Login failed", "Login blocked: user id locked"). The reason ("user not found", "not a bcrypt hash", "wrong password", "invalid input") goes to the server log only. The browser only ever sees "Invalid credentials !", or "Login unavailable…" when the database is unreachable.
- **Admin › "Hash mot de passe"** page (role `dbo.USER_.UPDATE_PSWD`): generates a bcrypt hash for a password, display only.
- **Login form:** show/hide password button, `autocomplete` hints, and a full page load after login, so browsers offer to save the credentials.
- **NextAuth Prisma adapter removed** (not used with Credentials + JWT).

## 2. Sessions
- **Database session check** on every page and API call (`checkSession()` in `src/lib/auth-lib.ts`), used by `proxy.ts` and the API routes. The open `/api/session` route is removed.
- **Fixed lifetime:** 1 day after login (`SESSION_MAX_AGE`), whatever the activity.
- **Bound to the browser and IP address:** a change of either one ends the session and writes a `LOG` entry ("Session revoked: …"). `TRUSTED_PROXY_COUNT` sets how the client IP is read behind a reverse proxy (`src/lib/client-info.ts`).
- **Only a SHA-256 of the session ID** is stored in `SESSION.SESSION_TOKEN`. The clear ID only exists in the encrypted cookie.
- **Profile › "Sessions" tab:** your active sessions, terminate one, or "Terminer les autres sessions".
- **Admin › "Sessions actives"** (role `dbo.SESSION.ADMIN`): all users' sessions, terminate any of them.
- Expired sessions are deleted at each login.

## 3. Authorisation (roles)
- **Every protected API route checks its role on the server:** `<TABLE>.LIST`, `.SHOW`, `.ADD`, `.UPDATE`, `.DELETE`. `sp/exec` checks `<PROC>.EXEC`; `sf/exec` only needs a login.
- **`user/*` routes** use the session's user ID and return 403 for another user. They never return `psw_hash`.
- **`maj-prix-detail` and `sp/exec` changed from GET to POST** (`sp/exec` takes a JSON body `{ spName, params }`), so a link on another site can no longer trigger them.
- **The sidebar and the menu search** show only the menus the user has the role for.

## 4. Error handling
- **Session ended:** API calls from an open page send the browser to the login page (`src/lib/apiFetch.ts`).
- **Notifications:** field checks, linked-record loads, export and print now show one instead of failing silently.
- **Error responses** contain only the database message, or else the error's own message (`src/lib/errorMessage.ts`).
- **One `pathname` variable** in each API route, used in all its messages.

## 5. Logging
- **`/api/protected/remote-log` removed:** API routes write audit rows straight to `LOG` with `dbLog()` (`src/lib/dbLog.ts`), with the user ID taken from the session.
- **`console.*` calls** replaced with `consoleDebug` / `consoleWarn` (dev mode only).

## 6. Bug fixes
- **Child-line DELETE** deleted by the parent ID instead of the line ID (6 routes).
- **Endless notifications** when the "Màj prix" stored procedure fails.
- **About 40 components** created inside other components (lists reloading and typed input lost on every re-render), plus the layout's styled components.
- **Server crash on page refresh** (`sessionStorage is not defined`) and the hydration mismatch in `AuthContext`.
- **Header search:** hooks called conditionally ("Rendered more hooks…").
- **Shared `Empty_*` objects** modified by the child pages.
- **Public pages** (`/`, `/about`, `/error`) no longer redirect to `/error` without a login.
- **Exact-match filters** (`{ value, exactFilter: true }` in `Filter<T>`) for parent and screen-set filters (`masterFilter`, `permanentFilter`). For example, rubric `TVA` no longer shows `TVA2`'s lines.
- **In-memory lists** filter on the values they display.

## 7. Code quality and dependencies
- **`'use server'`** removed from 86 files. The About page reads versions on the server.
- **ESLint** pinned to 9, so the linter works again. 88 unused variables and 64 `Number`/`String` types fixed.
- **`npm audit fix`:** Next 16.4.5, next-auth 4.24.15, Prisma 7.10.1. Vulnerabilities went from 39 to 16, with no critical ones left (`xlsx` remains: no fix on npm).
- **Packages:** `bcryptjs` added, `@next-auth/prisma-adapter` removed.

---

## Production checklist

### Database
1. Widen the password column:
   ```sql
   ALTER TABLE dbo.USER_ ALTER COLUMN PSW_HASH nvarchar(255) NULL;
   ```
2. Session table: add the columns, rename the existing ones, and add the indexes:
   ```sql
   ALTER TABLE dbo.Session ADD USER_AGENT nvarchar(500) NULL, IP_ADDRESS nvarchar(45) NULL;
   EXEC sp_rename 'dbo.Session.sessionToken', 'SESSION_TOKEN', 'COLUMN';
   EXEC sp_rename 'dbo.Session.userId', 'USER_ID', 'COLUMN';
   CREATE INDEX IDX_SESSION_USER_ID ON dbo.SESSION (USER_ID);
   CREATE INDEX IDX_SESSION_EXPIRES ON dbo.SESSION (EXPIRES);
   DELETE FROM dbo.SESSION;   -- old rows hold clear session ids
   ```
   Check them against what was actually run in dev: `src/prisma/schema/auth.prisma` must match the real column names (see `sql/Tables.sql`).
3. Add the new roles and assign them in `User_Role`: `DBO.USER_.UPDATE_PSWD`, `DBO.SESSION.ADMIN`.
4. **Check that every user has the `.LIST`, `.SHOW`, `.ADD`, `.UPDATE`, `.DELETE` (and `.EXEC`) roles they need.** Without them they get 401s and their menus disappear.
5. **Regenerate every user's `PSW_HASH` with bcrypt**, using the production `NEXTAUTH_SECRET`.

### Configuration
- **`NEXTAUTH_SECRET`** must be the same as the one used for the hashes. Changing it invalidates every password.
- **`TRUSTED_PROXY_COUNT`:** the number of reverse proxies in front of Next.js, for example `1` behind a Kubernetes Ingress. Behind Kubernetes, also set `externalTrafficPolicy: Local` on the Ingress controller's Service, or IP changes will log users out.
- **Don't set `NEXT_PUBLIC_USER_ID` / `NEXT_PUBLIC_PASSWORD`** in the production build: their values end up in the JavaScript sent to browsers.

### Build
- `npm install`, then `npx prisma generate`, then rebuild.
- Approve npm 12's install scripts for Prisma: `npm install-scripts approve prisma @prisma/engines`.

### What users will notice
- Everyone logs in once again.
- Sessions end exactly 1 day after login.
- A user whose browser or IP changes is logged out.

### Unlocking a user right away
```sql
DELETE FROM LOG WHERE USER_ID = 'XXX' AND MESSAGE = 'Login failed'
  AND DATE_OPER > DATEADD(MINUTE, -15, GETUTCDATE());
```
