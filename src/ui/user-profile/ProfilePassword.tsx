"use client";

import { useState } from "react";
import { Box, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signOut, useSession } from "next-auth/react";
import { BasicTextField } from "@/components/form-show/Inputs";
import { TipButton } from "@/components/ui/ActionButtons";
import SaveIcon from "@mui/icons-material/Save";
import { useAppContext } from "@/app/context/AppContext";
import { apiFetch } from "@/lib/apiFetch";
import { getResponseData } from "@/lib/html";
import { handleError } from "@/lib/error";
import { USER_FETCH_URL } from "@/types/user";
import { password_Change_Schema, Password_Change_Type } from "@/types/password-change";

type Field = keyof Password_Change_Type;

const EMPTY: Password_Change_Type = { current_password: "", new_password: "", confirm_password: "" };

type PasswordFieldProps = {
  name: Field;
  label: string;
  value: string;
  error?: string;
  autoComplete: string;
  onChange: (name: Field, value: string) => void;
};

// Module level (not inside ProfilePassword): keeps its identity across re-renders,
// so the field doesn't lose focus while typing.
const PasswordField = ({ name, label, value, error, autoComplete, onChange }: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  return (
    <BasicTextField
      name={name}
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      autoComplete={autoComplete}
      error={!!error}
      helperText={error}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onClick={() => setShow((v) => !v)}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

/**
 * Profile › "Mot de passe": the logged-in user changes their own password.
 * The server checks the current password, saves the new one (bcrypt) and ends the
 * user's other sessions.
 */
const ProfilePassword = () => {
  const { data: session } = useSession();
  const { addNotification } = useAppContext();
  const [values, setValues] = useState<Password_Change_Type>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (name: Field, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    // Same checks as the server, to show them under the fields
    const parsed = password_Change_Schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch(`${USER_FETCH_URL}/${encodeURIComponent(userId)}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      await getResponseData(response, "Changement du mot de passe");
      // All the user's sessions are ended on the server: sign out (clears the cookie)
      // and log in again with the new password
      await signOut({ callbackUrl: "/auth/login?error=PasswordChanged", redirect: true });
      return;
    }
    catch (err) {
      handleError("Changement du mot de passe", err, addNotification);
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{ maxWidth: 520, pt: 1 }}
      onSubmit={(e) => { e.preventDefault(); handleSave(); }}
    >
      <Stack spacing={1}>
        <PasswordField name="current_password" label="Mot de passe actuel" value={values.current_password}
          error={errors.current_password} autoComplete="current-password" onChange={handleChange} />
        <PasswordField name="new_password" label="Nouveau mot de passe" value={values.new_password}
          error={errors.new_password} autoComplete="new-password" onChange={handleChange} />
        <PasswordField name="confirm_password" label="Confirmer le nouveau mot de passe" value={values.confirm_password}
          error={errors.confirm_password} autoComplete="new-password" onChange={handleChange} />
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          Au moins 6 caractères, différent de l&apos;actuel. Toutes vos sessions seront terminées : vous vous reconnecterez avec le nouveau mot de passe.
        </Typography>
        <Box sx={{ px: 1, pt: 1 }}>
          <TipButton tip="Changer le mot de passe" type="submit" color="success" startIcon={<SaveIcon />} disabled={saving}>
            Changer le mot de passe
          </TipButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfilePassword;
