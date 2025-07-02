import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { DEFAULT_SHORT_URL_SLUG_REGEX } from '@/constants';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';
import { incrementClickCountBySlug } from './increment-click-count-by-slug';

const getOriginalLinkBySlugInput = z.object({
  slug: z.string().regex(DEFAULT_SHORT_URL_SLUG_REGEX),
});

type GetOriginalLinkBySlugInput = z.infer<typeof getOriginalLinkBySlugInput>;

export async function getOriginalLinkBySlug(
  input: GetOriginalLinkBySlugInput,
): Promise<Either<ShortLinkNotFoundError, { originalUrl: string }>> {
  const { slug } = getOriginalLinkBySlugInput.parse(input);

  const result = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.slug, slug));

  if (result.length === 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  const link = result[0];

  // Async increment without awaiting
  void incrementClickCountBySlug(slug);

  return makeRight({ originalUrl: link.originalUrl });
}
