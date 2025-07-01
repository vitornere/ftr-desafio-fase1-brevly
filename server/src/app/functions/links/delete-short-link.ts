import { eq } from 'drizzle-orm';
import { DEFAULT_SHORT_URL_PREFIX } from '@/constants';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';

export async function deleteShortLink(
  slug: string,
): Promise<Either<ShortLinkNotFoundError, null>> {
  const shortUrl = `${DEFAULT_SHORT_URL_PREFIX}${slug}`;
  console.log(shortUrl);

  const result = await db
    .delete(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .returning();

  if (result.length === 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  return makeRight(null);
}
