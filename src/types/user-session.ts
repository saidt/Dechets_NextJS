import { Column } from "@/lib/types";
import { formatDateTime } from "@/lib/date-utils";
import { describeBrowser } from "@/lib/user-agent";

export const USER_SESSION_CHILD_URL : string = "session"

/** A login session of the current user, as shown on the profile page (no session token). */
export type User_Session_Type = {
  id: string;            // Session row id, used to terminate it
  started: string;       // ISO date: login time
  expires: string;       // ISO date
  userAgent: string | null;
  ipAddress: string | null;
  current: boolean;      // the session making this request
};

export const user_Session_Columns: Column<User_Session_Type>[] = [
  {
    accessor: "started",
    header: "Début",
    width: 170,
    accessorFn: (row: User_Session_Type) => formatDateTime(new Date(row.started)),
  },
  {
    accessor: "expires",
    header: "Expire",
    width: 170,
    accessorFn: (row: User_Session_Type) => formatDateTime(new Date(row.expires)),
  },
  {
    accessor: "userAgent",
    header: "Navigateur",
    width: 220,
    accessorFn: (row: User_Session_Type) => describeBrowser(row.userAgent),
  },
  {
    accessor: "ipAddress",
    header: "Adresse IP",
    width: 150,
    accessorFn: (row: User_Session_Type) => row.ipAddress ?? "",
  },
  {
    accessor: "current",
    header: "Session actuelle",
    width: 130,
    accessorFn: (row: User_Session_Type) => (row.current ? "Oui" : ""),
  },
];
