import { z } from 'zod';

export type Credentials = {
  userId: string; 
  password: string;
};

export const credentials_Schema = z.object({
  userId: z.string().min(1, "Invalid user id"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type Credentials_Form_Data = z.infer<typeof credentials_Schema>;