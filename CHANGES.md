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

## 8. Since the first summary (2026-11-23 → 2026-11-26)
About 40 commits, 105 files changed.

### Authorisation
- **Super user:** `USER_.SUPER_USER = 'O'` passes every role check without `USER_ROLE` rows, on the server (`has_User_Role`, used by `checkRole`, `sp/exec`, `sp/param`) and in the screens (`hasRole` / `hasAnyRole`). Session checks and the own-data checks of `user/*` still apply. Only settable in SQL (see the checklist).
- **Child tabs** (sortie lignes / détails, retour, règlement, versement lignes, paramètre lignes) are shown only with the child table's `.LIST` role, instead of sending the user to the error page.

### Lists
- **Status bar** above the pagination: current sort, column filters (`=` for exact ones), quick search and the screen's fixed filter ("Filtre fixe"). Display only, bold.
- **Default sort:** `initialSort` on `GenericListPage` / `GenericMemListPage`, set on every server list from its `*_DEFAULT_SORT`, and on the profile and admin session lists (newest first) and profile roles (`role_id`). Lists filled by stored procedures keep the procedure's order.
- **Date pièce initial filter:** sorties, retours, règlements and versements start with `date_piece >=` the 1st of last month (`firstDayOfMonthOffset(-1)` in `date-utils`), as `initialFilter` unless the caller passes one. The date column's filter shows it and the user can change or clear it there.
- **Filter operators** in every list, server and in-memory: `=`, `<>`, `>=`, `<=`, `>`, `<` for dates (by day, DD/MM/YYYY), numbers and text; no operator keeps the default (text contains, number equals, date that day). In text, `%` is a wildcard: `AB%` starts with, `%AB` ends with, `%AB%` contains. `exactFilter` values are matched as they are. Shared parser: `src/lib/filterOperator.ts`.
- **Saved filters:** GLOBAL filters (set by admins in SQL, or saved from the app then changed to `TYPE = 'GLOBAL'`) are now loaded for every user; they never loaded before. They can't be overwritten or deleted from the app (save refused, `DELETE` answers 403). Saving a new filter now returns it (the insert was not awaited).

### Forms
- **`BasicTextField` kept the `slotProps` it was given:** the lock, clear, pick-list and follow icons were never shown in forms; now they are.
- **`MuiDatePicker`** (date only, stored at 00:00 UTC) replaces `MuiDateTimePicker` on the DD/MM/YYYY fields. New records start with today's date (`todayUtc()`) instead of the time the page was loaded.
- **Reference fields:** double-click opens the pick-list (create and edit modes); the dialog's close icon now closes it.
- **Hash page:** show/hide password icon, "Copier" button next to "Générer".
- **Tooltips** show on disabled toolbar buttons (`TipButton` wraps the button in a `span`), with no MUI warning.

### Période
- **Statistics crash fixed** (`date.getDate is not a function`): the period's dates arrive from JSON as strings and are now converted to `Date`.
- **When the period can't be read**, it defaults to the current month and the error is shown; the screens now apply those dates.

### Reports
- **Master/detail prints** for règlements, retours and paramètres (SaidT).
- **`accessorFn` columns** are formatted in PDFs like on screen (dates as DD/MM/YYYY, numbers with their decimals), e.g. the règlement date in the versement print.
- **React "key" warning** fixed when printing a record (`ReportDetail`).

### Other (SaidT)
- Dashboard counts of sorties and retours (all and non validés) moved to Prisma queries; period start/end dates corrected.
- `localLog` calls the API with a relative URL (no server address).
- "Throw error" test button removed from the home page; `consoleInfo` calls removed.

### Documentation
- **`RAPPORT_TECHNIQUE.docx`:** technical report (packages, structure, features, authentication, security, lists, forms, master/detail, reports, database and logging, known limits), updated with the changes above. It is the only copy, edited in Word; `CLAUDE.md` says to edit it in place.

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
3. Add the super user flag (`'O'` = passes every role check, `'N'` = normal user):
   ```sql
   ALTER TABLE dbo.USER_ ADD SUPER_USER char(1) NOT NULL DEFAULT 'N';
   UPDATE dbo.USER_ SET SUPER_USER = 'O' WHERE ID = 'XXX';   -- the super users
   ```
4. Add the new roles and assign them in `User_Role`: `DBO.USER_.UPDATE_PSWD`, `DBO.SESSION.ADMIN`.
5. **Check that every user has the `.LIST`, `.SHOW`, `.ADD`, `.UPDATE`, `.DELETE` (and `.EXEC`) roles they need.** Without them they get 401s and their menus disappear.
6. **Regenerate every user's `PSW_HASH` with bcrypt**, using the production `NEXTAUTH_SECRET`.

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
