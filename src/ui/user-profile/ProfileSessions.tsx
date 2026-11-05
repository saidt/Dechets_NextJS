"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import BlankCard from "@/components/shared/BlankCard";
import { RefreshButton } from "@/components/ui/ActionButtons";
import { LoadingBar } from "@/components/ui/LoadingBar";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { useAppContext } from "@/app/context/AppContext";
import { apiFetch } from "@/lib/apiFetch";
import { getResponseData } from "@/lib/html";
import { handleError } from "@/lib/error";
import { formatDateTime } from "@/lib/date-utils";
import { ROLES_CACHE_KEY } from "@/lib/consts";
import { USER_FETCH_URL } from "@/types/user";
import { USER_SESSION_CHILD_URL, User_Session_Type } from "@/types/user-session";

/** "Chrome 131 / Windows" from a User-Agent string (best effort, for display only). */
function describeBrowser(userAgent: string | null): string {
  if (!userAgent) return "Inconnu";
  const browser =
    userAgent.match(/Edg\/(\d+)/) ? `Edge ${userAgent.match(/Edg\/(\d+)/)![1]}` :
    userAgent.match(/OPR\/(\d+)/) ? `Opera ${userAgent.match(/OPR\/(\d+)/)![1]}` :
    userAgent.match(/Firefox\/(\d+)/) ? `Firefox ${userAgent.match(/Firefox\/(\d+)/)![1]}` :
    userAgent.match(/Chrome\/(\d+)/) ? `Chrome ${userAgent.match(/Chrome\/(\d+)/)![1]}` :
    userAgent.match(/Version\/(\d+).*Safari/) ? `Safari ${userAgent.match(/Version\/(\d+)/)![1]}` :
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

const ProfileSessions = () => {
  const { data: session } = useSession();
  const { addNotification } = useAppContext();
  const [sessions, setSessions] = useState<User_Session_Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [toTerminate, setToTerminate] = useState<User_Session_Type | null>(null);

  const userId = session?.user?.id;
  const sessionsUrl = userId ? `${USER_FETCH_URL}/${encodeURIComponent(userId)}/${USER_SESSION_CHILD_URL}` : null;

  const loadSessions = useCallback(async () => {
    if (!sessionsUrl) return;
    setLoading(true);
    try {
      const response = await apiFetch(sessionsUrl);
      const result = await getResponseData(response, "ProfileSessions loadSessions");
      setSessions(result.data);
    }
    catch (err) {
      handleError("Failed to load sessions", err, addNotification);
    }
    finally {
      setLoading(false);
    }
  }, [sessionsUrl, addNotification]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleTerminate = async () => {
    const target = toTerminate;
    setToTerminate(null);
    if (!target || !sessionsUrl) return;
    setLoading(true);
    try {
      const response = await apiFetch(`${sessionsUrl}/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      await getResponseData(response, "ProfileSessions handleTerminate");
      if (target.current) {
        // This browser's own session: log out now instead of waiting for the next request
        sessionStorage.removeItem(ROLES_CACHE_KEY);
        await signOut({ callbackUrl: "/auth/login", redirect: true });
        return;
      }
      addNotification("Session terminée", "success");
      await loadSessions();
    }
    catch (err) {
      handleError("Failed to terminate session", err, addNotification);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <BlankCard>
      <LoadingBar loading={loading} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            Sessions ouvertes avec votre compte. Terminer une session déconnecte le navigateur qui l&apos;utilise.
          </Typography>
          <RefreshButton onClick={loadSessions}>Rafraîchir</RefreshButton>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Début</TableCell>
                <TableCell>Expire</TableCell>
                <TableCell>Navigateur</TableCell>
                <TableCell>Adresse IP</TableCell>
                <TableCell />
                <TableCell align="right">Terminer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6}>Aucune session active</TableCell>
                </TableRow>
              )}
              {sessions.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{formatDateTime(new Date(s.started))}</TableCell>
                  <TableCell>{formatDateTime(new Date(s.expires))}</TableCell>
                  <TableCell>
                    <Tooltip title={s.userAgent ?? ""}>
                      <span>{describeBrowser(s.userAgent)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{s.ipAddress || "—"}</TableCell>
                  <TableCell>
                    {s.current && <Chip label="Session actuelle" color="primary" size="small" />}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={s.current ? "Terminer cette session (vous serez déconnecté)" : "Terminer cette session"}>
                      <span>
                        <IconButton
                          aria-label="Terminer la session"
                          color="error"
                          onClick={() => setToTerminate(s)}
                          disabled={loading}
                        >
                          <LogoutIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ConfirmationDialog
        open={toTerminate !== null}
        onClose={() => setToTerminate(null)}
        onConfirm={handleTerminate}
        title="Terminer la session"
        description={
          toTerminate?.current
            ? "C'est la session de ce navigateur : vous serez déconnecté. Continuer ?"
            : `Terminer la session ${describeBrowser(toTerminate?.userAgent ?? null)} (${toTerminate?.ipAddress || "IP inconnue"}) ?`
        }
      />
    </BlankCard>
  );
};

export default ProfileSessions;
