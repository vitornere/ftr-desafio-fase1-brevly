import { eq, sql } from 'drizzle-orm';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export async function incrementClickCountBySlug(slug: string): Promise<void> {
  await db
    .update(schema.links)
    .set({ clicks: sql`${schema.links.clicks} + 1` })
    .where(eq(schema.links.slug, slug))
    .execute()
    .catch((err) => {
      // TODO: handle error into a error tracking system
      console.error('Failed to increment clicks:', err);
    });
}
