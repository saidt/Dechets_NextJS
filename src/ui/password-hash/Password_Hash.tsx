"use client";

import { useEffect, useState } from "react";
import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import TitleCard from "@/components/shared/TitleCard";
import { ExecuteButton } from "@/components/ui/ActionButtons";
import { LoadingBar } from "@/components/ui/LoadingBar";
import Loading from "@/components/ui/Loading";
import { useAppContext } from "@/app/context/AppContext";
import useAuth from "@/app/context/UseAuth";
import { apiFetch } from "@/lib/apiFetch";
import { getResponseData } from "@/lib/html";
import { clientError, handleError } from "@/lib/error";
import { PASSWORD_HASH_FETCH_URL, USER_UPDATE_PSWD_ROLE } from "@/types/user";

// Generates a USER_.PSW_HASH value for a user id + password (display only).
// The hash is computed by the API route: NEXTAUTH_SECRET never reaches the browser.
const Password_Hash = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { addNotification, getCurrentUrl } = useAppContext();
  const { hasRole, authLoading } = useAuth();
  const router = useRouter();
  const curUrl = getCurrentUrl();
  const authorized = hasRole(USER_UPDATE_PSWD_ROLE);

  useEffect(() => {
    if (!authLoading && !authorized) {
      clientError(`${USER_UPDATE_PSWD_ROLE}: vous n'avez pas le droit d'utiliser cette page !`, null, curUrl || "/", router);
    }
  }, [authLoading, authorized, curUrl, router]);

  const handleGenerate = async () => {
    setHash("");
    if (!userId.trim() || !password) {
      addNotification("Saisir l'utilisateur et le mot de passe", "warning");
      return;
    }
    setLoading(true);
    try {
      const response = await apiFetch(PASSWORD_HASH_FETCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });
      const data = await getResponseData(response, "Password_Hash handleGenerate");
      setHash(data.hash);
    }
    catch (err) {
      handleError("Password hash failed", err, addNotification);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      addNotification("Hash copié", "success");
    }
    catch (err) {
      handleError("Copy failed", err, addNotification);
    }
  };

  if (authLoading) return <Loading />;
  if (!authorized) return null;

  return (
    <TitleCard title="Hash mot de passe">
      <LoadingBar loading={loading} />
      <Stack spacing={2} sx={{ maxWidth: 700 }}>
        <Typography variant="body2" color="text.secondary">
          Génère la valeur à copier dans USER_.PSW_HASH. Rien n'est enregistré en base.
        </Typography>
        <TextField
          label="Utilisateur (USER_.ID)"
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setHash(""); }}
          autoComplete="off"
          fullWidth
        />
        <TextField
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setHash(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
          autoComplete="new-password"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Box>
          <ExecuteButton onClick={handleGenerate} disabled={loading}>
            Générer
          </ExecuteButton>
        </Box>
        <TextField
          label="Hash (USER_.PSW_HASH)"
          value={hash}
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
              sx: { fontFamily: "monospace" },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copier">
                    <span>
                      <IconButton aria-label="Copier le hash" onClick={handleCopy} disabled={!hash} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </TitleCard>
  );
};

export default Password_Hash;
