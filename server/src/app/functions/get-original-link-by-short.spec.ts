import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';
import { getOriginalLinkByShort } from './get-original-link-by-short';

beforeEach(async () => {
  await db.delete(schema.links);
});

describe('getOriginalLinkByShort', () => {
  it('should return the original link', async () => {
    const links = await seedLinks();

    const result = await getOriginalLinkByShort({
      shortUrl: links[0].shortUrl,
    });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual({
      originalUrl: links[0].originalUrl,
    });
  });

  it('should return an error if the short url is not found', async () => {
    const result = await getOriginalLinkByShort({
      shortUrl: 'http://localhost:3000/non-existent-short-url',
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toEqual(new ShortLinkNotFoundError());
  });
});
