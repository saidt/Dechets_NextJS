import { Column } from "@/lib/types";
import { User_Session_Type, user_Session_Columns } from "./user-session";

export const SESSION_ADMIN_ROLE : string = "dbo.SESSION.ADMIN"
export const ADMIN_SESSIONS_URL : string = "/protected/admin/sessions"
export const ADMIN_SESSIONS_FETCH_URL : string = "/api/protected/session"

/** A login session of any user, for the admin "Sessions actives" page (no session token). */
export type Admin_Session_Type = User_Session_Type & {
  userId: string;
  userName: string | null;
};

export const admin_Session_Columns: Column<Admin_Session_Type>[] = [
  {
    accessor: "userId",
    header: "Utilisateur",
    width: 120,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "userName",
    header: "Nom",
    width: 180,
    accessorFn: (row: Admin_Session_Type) => row.userName ?? "",
  },
  ...(user_Session_Columns as unknown as Column<Admin_Session_Type>[]),
];
