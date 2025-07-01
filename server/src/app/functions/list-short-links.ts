import { desc } from 'drizzle-orm';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeRight } from '@/shared/either';

export async function listShortLinks(): Promise<
  Either<never, { originalUrl: string; slug: string; clicks: number }[]>
> {
  const result = await db
    .select({
      originalUrl: schema.links.originalUrl,
      slug: schema.links.slug,
      clicks: schema.links.clicks,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.created_at));

  return makeRight(result);
}
