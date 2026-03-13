import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_UNPOOLED: z.string().optional(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional().default("noreply@example.com"),

  // SMS
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),

  // Scraper
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),

  // Node
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
