"use client";

import BlankCard from "../../components/shared/BlankCard";
import { GenericMemListPage } from "@/components/datatable/GenericMemListPage";
import { USER_SESSION_CHILD_URL, user_Session_Columns, User_Session_Type } from "@/types/user-session";
import { signOut, useSession } from "next-auth/react";
import { USER_FETCH_URL } from "@/types/user";
import { apiFetch } from "@/lib/apiFetch";
import { getResponseData } from "@/lib/html";
import { useRouter } from "next/navigation";
import useAuth from "@/app/context/UseAuth";
import { useEffect, useState } from "react";
import { clientError, handleError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { ROLES_CACHE_KEY } from "@/lib/consts";
import { describeBrowser } from "@/lib/user-agent";

const ProfileSessions = () => {
  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const router = useRouter();
  const { getCurrentUrl, addNotification } = useAppContext();
  const curUrl = getCurrentUrl()
  const user = session?.user;

  const [toTerminate, setToTerminate] = useState<User_Session_Type | null>(null);
  const [terminating, setTerminating] = useState(false);
  // Changing the key remounts the list, which reloads the sessions
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("ProfileSessions: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  const sessionsUrl = user ? `${USER_FETCH_URL}/${encodeURIComponent(user.id)}/${USER_SESSION_CHILD_URL}` : '';

  async function fetchAllRows() : Promise<User_Session_Type[]> {
    if (! user) {
      return Promise.reject(null)
    }
    const response = await apiFetch(sessionsUrl);
    const result = await getResponseData(response, 'ProfileSessions fetchAllRows');
    return result.data
  }

  const handleTerminate = async () => {
    const target = toTerminate;
    setToTerminate(null);
    if (!target || !user) return;
    setTerminating(true);
    try {
      const response = await apiFetch(`${sessionsUrl}/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      await getResponseData(response, 'ProfileSessions handleTerminate');
      if (target.current) {
        // This browser's own session: log out now instead of waiting for the next request
        sessionStorage.removeItem(ROLES_CACHE_KEY);
        await signOut({ callbackUrl: "/auth/login", redirect: true });
        return;
      }
      addNotification("Session terminée", "success");
      setReloadKey((k) => k + 1);
    }
    catch (err) {
      handleError("Failed to terminate session", err, addNotification);
    }
    finally {
      setTerminating(false);
    }
  };

  // Per-row "Terminer" button, in the Actions column (same mechanism as GenericListPage)
  const renderRowActions = (row: User_Session_Type) => (
    <Tooltip title={row.current ? "Terminer cette session (vous serez déconnecté)" : "Terminer cette session"}>
      <span>
        <IconButton aria-label="Terminer la session" color="error" size="small" onClick={() => setToTerminate(row)}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );

  if (!session || !user) return null;

  return (
    <BlankCard>
      <GenericMemListPage<User_Session_Type>
        key={reloadKey}
        title="Sessions de l'utilisateur"
        columns={user_Session_Columns}
        isModalList={false}
        fetchAllData={fetchAllRows}
        renderRowActions={renderRowActions}
        loading={authLoading || terminating}
      />
      <ConfirmationDialog
        open={toTerminate !== null}
        onClose={() => setToTerminate(null)}
        onConfirm={handleTerminate}
        title="Terminer la session"
        description={
          toTerminate?.current
            ? "C'est la session de ce navigateur : vous serez déconnecté. Continuer ?"
            : `Terminer la session ${describeBrowser(toTerminate?.userAgent)} (${toTerminate?.ipAddress || "IP inconnue"}) ?`
        }
      />
    </BlankCard>
  );
};

export default ProfileSessions;
