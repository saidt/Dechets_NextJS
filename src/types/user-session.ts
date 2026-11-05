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
