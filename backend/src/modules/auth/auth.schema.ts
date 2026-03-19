import { z } from "zod";

export const loginSchema = z.object({
  email: z.string("Email is required").email("Invalid email address"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters"),
});

export type TLogin = z.infer<typeof loginSchema>;
