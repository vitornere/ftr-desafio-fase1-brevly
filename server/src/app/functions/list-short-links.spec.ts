import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isRight, unwrapEither } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { listShortLinks } from './list-short-links';

beforeEach(async () => {
  await db.delete(schema.links);
});

describe('listShortLinks', () => {
  it('should return all links', async () => {
    const links = await seedLinks(3);

    const result = await listShortLinks();

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual([
      {
        originalUrl: links[0].originalUrl,
        shortUrl: links[0].shortUrl,
        clicks: links[0].clicks,
      },
      {
        originalUrl: links[1].originalUrl,
        shortUrl: links[1].shortUrl,
        clicks: links[1].clicks,
      },
      {
        originalUrl: links[2].originalUrl,
        shortUrl: links[2].shortUrl,
        clicks: links[2].clicks,
      },
    ]);
  });

  it('should return empty array if there are no links', async () => {
    const result = await listShortLinks();

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual([]);
  });
});
