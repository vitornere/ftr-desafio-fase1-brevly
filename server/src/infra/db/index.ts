import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env';
import { schema } from './schemas';

const isProduction = process.env.NODE_ENV === 'production';

const sslOption = isProduction ? { rejectUnauthorized: false } : false;

export const pg = postgres(env.DATABASE_URL, {
  ssl: sslOption,
});
export const db = drizzle(pg, { schema });
