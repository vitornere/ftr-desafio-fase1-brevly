import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    originalUrl: varchar('original_url', { length: 2048 }).notNull(),
    shortUrl: varchar('short_url', { length: 255 }).notNull(),
    clicks: integer('clicks').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('short_url_idx').on(table.shortUrl)],
);
