/** biome-ignore-all lint/suspicious/noExplicitAny: just for testing */
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { db } from '@/infra/db';

export async function withTransaction<T>(
  fn: (trx: NodePgDatabase<any> | PgTransaction<any, any>) => Promise<T>,
): Promise<T> {
  return await db.transaction(async (trx) => {
    try {
      const result = await fn(trx);
      trx.rollback();
      return result;
    } catch (err) {
      trx.rollback();
      throw err;
    }
  });
}
