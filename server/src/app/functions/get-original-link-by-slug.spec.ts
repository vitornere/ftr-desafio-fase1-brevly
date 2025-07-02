import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { ShortLinkNotFoundError } from './errors/short-link-not-found';
import { getOriginalLinkBySlug } from './get-original-link-by-slug';

describe('getOriginalLinkBySlug', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  it('should return the original link', async () => {
    const links = await seedLinks();

    const result = await getOriginalLinkBySlug({
      slug: links[0].slug,
    });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual({
      originalUrl: links[0].originalUrl,
    });
  });

  it('should return an error if the slug is not found', async () => {
    const result = await getOriginalLinkBySlug({
      slug: 'non-existent-short-url',
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toEqual(new ShortLinkNotFoundError());
  });
});
