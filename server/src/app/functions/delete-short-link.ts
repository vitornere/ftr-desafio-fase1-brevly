import { eq } from 'drizzle-orm';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';

export async function deleteShortLink(
  slug: string,
): Promise<Either<ShortLinkNotFoundError, null>> {
  const result = await db
    .delete(schema.links)
    .where(eq(schema.links.slug, slug))
    .returning();

  if (result.length === 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  return makeRight(null);
}
