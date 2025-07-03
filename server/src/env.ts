import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(['test', 'development', 'production'])
    .default('development'),
  DATABASE_URL: z
    .url()
    .startsWith('postgres')
    .default('postgres://postgres:postgres@localhost:5432/postgres'),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.url(),
  DEFAULT_SHORT_URL_DOMAIN: z
    .url()
    .default(
      process.env.NODE_ENV === 'production'
        ? 'https://brev.ly'
        : 'http://localhost:3000',
    ),
});

export const env = envSchema.parse(process.env);
