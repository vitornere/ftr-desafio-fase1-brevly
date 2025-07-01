import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import {
  DEFAULT_SHORT_URL_PREFIX,
  DEFAULT_SHORT_URL_SLUG_REGEX,
} from '@/constants';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';

const getOriginalLinkByShortInput = z.object({
  shortUrl: z.url().refine(
    (url) => {
      if (!url.startsWith(DEFAULT_SHORT_URL_PREFIX)) return false;

      const slug = url.replace(DEFAULT_SHORT_URL_PREFIX, '');
      return DEFAULT_SHORT_URL_SLUG_REGEX.test(slug);
    },
    {
      message: `A URL encurtada deve começar com "${DEFAULT_SHORT_URL_PREFIX}" e conter apenas letras, números, hífens ou underlines após o prefixo.`,
    },
  ),
});

type GetOriginalLinkByShortInput = z.infer<typeof getOriginalLinkByShortInput>;

export async function getOriginalLinkByShort(
  input: GetOriginalLinkByShortInput,
): Promise<Either<ShortLinkNotFoundError, { originalUrl: string }>> {
  const { shortUrl } = getOriginalLinkByShortInput.parse(input);

  const result = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl));

  if (result.length === 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  return makeRight({ originalUrl: result[0].originalUrl });
}
