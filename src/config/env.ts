import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.union([z.string(), z.number()]).default('5000').transform((val) => Number(val) || 5000),
  NODE_ENV: z.string().default('development'),
  APP_NAME: z.string().default('DnyanX Ultimate Business OS'),
  APP_URL: z.string().default('http://localhost:5000'),
  CORS_ORIGIN: z.string().default('*'),
  WHATSAPP_VERIFY_TOKEN: z.string().default('dnyanx_secure_verify_token_2026'),
  WHATSAPP_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

export const env = _env.success
  ? _env.data
  : {
      PORT: 5000,
      NODE_ENV: 'production',
      APP_NAME: 'DnyanX Ultimate Business OS',
      APP_URL: 'http://localhost:5000',
      CORS_ORIGIN: '*',
      WHATSAPP_VERIFY_TOKEN: 'dnyanx_secure_verify_token_2026',
    };
