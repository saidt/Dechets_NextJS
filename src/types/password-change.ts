import { z } from 'zod';
import { credentials_Schema } from './credentials';

/** Profile › "Mot de passe": the user's own password change. */
export const password_Change_Schema = z.object({
  current_password: z.string().min(1, "Saisir le mot de passe actuel"),
  // Same rule as the login form
  new_password: credentials_Schema.shape.password,
  confirm_password: z.string(),
})
  .refine((d) => d.new_password === d.confirm_password, {
    path: ['confirm_password'], message: "La confirmation ne correspond pas au nouveau mot de passe",
  })
  .refine((d) => d.new_password !== d.current_password, {
    path: ['new_password'], message: "Le nouveau mot de passe doit être différent de l'actuel",
  });

export type Password_Change_Type = z.infer<typeof password_Change_Schema>;

export const PASSWORD_CHANGED_MESSAGE = "Password changed";
