import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z.string(), // comma separated list
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
