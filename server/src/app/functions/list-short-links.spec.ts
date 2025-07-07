import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isRight, unwrapEither } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { listShortLinks } from './list-short-links';

describe('listShortLinks', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  it('should return all links', async () => {
    const links = await seedLinks(3);

    const result = await listShortLinks();

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual([
      {
        originalUrl: links[0].originalUrl,
        slug: links[0].slug,
        clicks: links[0].clicks,
        createdAt: links[0].createdAt,
      },
      {
        originalUrl: links[1].originalUrl,
        slug: links[1].slug,
        clicks: links[1].clicks,
        createdAt: links[1].createdAt,
      },
      {
        originalUrl: links[2].originalUrl,
        slug: links[2].slug,
        clicks: links[2].clicks,
        createdAt: links[2].createdAt,
      },
    ]);
  });

  it('should return empty array if there are no links', async () => {
    const result = await listShortLinks();

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual([]);
  });
});
