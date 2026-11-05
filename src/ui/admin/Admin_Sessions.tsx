"use client";

import BlankCard from "../../components/shared/BlankCard";
import { GenericMemListPage } from "@/components/datatable/GenericMemListPage";
import { admin_Session_Columns, Admin_Session_Type, ADMIN_SESSIONS_FETCH_URL, SESSION_ADMIN_ROLE } from "@/types/admin-session";
import { signOut, useSession } from "next-auth/react";
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
import Loading from "@/components/ui/Loading";
import { ROLES_CACHE_KEY } from "@/lib/consts";
import { describeBrowser } from "@/lib/user-agent";

// Same as the profile "Sessions" tab, for the sessions of all users (role dbo.SESSION.ADMIN)
const Admin_Sessions = () => {
  const { data: session, status } = useSession();
  const { hasRole, authLoading } = useAuth();
  const router = useRouter();
  const { getCurrentUrl, addNotification } = useAppContext();
  const curUrl = getCurrentUrl()
  const user = session?.user;
  const authorized = hasRole(SESSION_ADMIN_ROLE);

  const [toTerminate, setToTerminate] = useState<Admin_Session_Type | null>(null);
  const [terminating, setTerminating] = useState(false);
  // Changing the key remounts the list, which reloads the sessions
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && !authorized) {
      clientError(`${SESSION_ADMIN_ROLE}: vous n'avez pas le droit de consulter cette page !`, null, curUrl || "/", router);
    }
  }, [status, authLoading, authorized, curUrl, router]);

  async function fetchAllRows() : Promise<Admin_Session_Type[]> {
    const response = await apiFetch(ADMIN_SESSIONS_FETCH_URL);
    const result = await getResponseData(response, 'Admin_Sessions fetchAllRows');
    return result.data
  }

  const handleTerminate = async () => {
    const target = toTerminate;
    setToTerminate(null);
    if (!target) return;
    setTerminating(true);
    try {
      const response = await apiFetch(`${ADMIN_SESSIONS_FETCH_URL}/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      await getResponseData(response, 'Admin_Sessions handleTerminate');
      if (target.current) {
        // The admin's own session in this browser: log out now
        sessionStorage.removeItem(ROLES_CACHE_KEY);
        await signOut({ callbackUrl: "/auth/login", redirect: true });
        return;
      }
      addNotification(`Session de ${target.userId} terminée`, "success");
      setReloadKey((k) => k + 1);
    }
    catch (err) {
      handleError("Failed to terminate session", err, addNotification);
    }
    finally {
      setTerminating(false);
    }
  };

  // Per-row "Terminer" button, in the Actions column
  const renderRowActions = (row: Admin_Session_Type) => (
    <Tooltip title={row.current ? "Terminer cette session (vous serez déconnecté)" : `Terminer la session de ${row.userId}`}>
      <span>
        <IconButton aria-label="Terminer la session" color="error" size="small" onClick={() => setToTerminate(row)}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user || !authorized) return null;

  return (
    <BlankCard>
      <GenericMemListPage<Admin_Session_Type>
        key={reloadKey}
        title="Sessions actives"
        columns={admin_Session_Columns}
        isModalList={false}
        fetchAllData={fetchAllRows}
        renderRowActions={renderRowActions}
        loading={terminating}
      />
      <ConfirmationDialog
        open={toTerminate !== null}
        onClose={() => setToTerminate(null)}
        onConfirm={handleTerminate}
        title="Terminer la session"
        description={
          toTerminate?.current
            ? "C'est votre session dans ce navigateur : vous serez déconnecté. Continuer ?"
            : `Terminer la session de ${toTerminate?.userId} : ${describeBrowser(toTerminate?.userAgent)} (${toTerminate?.ipAddress || "IP inconnue"}) ?`
        }
      />
    </BlankCard>
  );
};

export default Admin_Sessions;
