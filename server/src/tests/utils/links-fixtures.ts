import { faker } from '@faker-js/faker';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export function generateFakeLink() {
  return {
    id: faker.string.uuid(),
    originalUrl: faker.internet.url(),
    shortUrl: `http://localhost:3000/${faker.string.alphanumeric(8)}`,
    clicks: faker.number.int({ min: 0, max: 1000 }),
    created_at: faker.date.recent(),
  };
}

export async function seedLinks(count = 1) {
  const links = Array.from({ length: count }, generateFakeLink);

  return await db
    .insert(schema.links)
    .values(
      links.map((link) => ({
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        clicks: link.clicks,
      })),
    )
    .returning();
}
