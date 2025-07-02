import { count } from 'drizzle-orm';
import { beforeEach, describe, expect, test } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { deleteShortLink } from './delete-short-link';

describe('deleteShortLink', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  test('should return a left if the short link is not found', async () => {
    const result = await deleteShortLink('not-found');
    expect(isLeft(result)).toBe(true);
  });

  test('should return a right if the short link is found', async () => {
    const links = await seedLinks();

    const result = await deleteShortLink(links[0].slug);
    expect(isRight(result)).toBe(true);

    const resultQuery = await db
      .select({
        count: count(),
      })
      .from(schema.links);

    expect(resultQuery[0].count).toBe(0);
  });
});
