import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { DEFAULT_SHORT_URL_SLUG_REGEX } from '@/constants';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';

const getOriginalLinkByShortInput = z.object({
  slug: z.string().regex(DEFAULT_SHORT_URL_SLUG_REGEX),
});

type GetOriginalLinkByShortInput = z.infer<typeof getOriginalLinkByShortInput>;

export async function getOriginalLinkByShort(
  input: GetOriginalLinkByShortInput,
): Promise<Either<ShortLinkNotFoundError, { originalUrl: string }>> {
  const { slug } = getOriginalLinkByShortInput.parse(input);

  const result = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.slug, slug));

  if (result.length === 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  return makeRight({ originalUrl: result[0].originalUrl });
}
