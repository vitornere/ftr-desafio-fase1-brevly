import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, test } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { incrementClickCountBySlug } from './increment-click-count-by-slug';

describe('incrementClickCountBySlug', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  test('increments click count', async () => {
    const links = await seedLinks();

    await incrementClickCountBySlug(links[0].slug);

    const updated = await db.query.links.findFirst({
      where: eq(schema.links.id, links[0].id),
    });

    expect(updated?.clicks).toBe(links[0].clicks + 1);
  });
});
