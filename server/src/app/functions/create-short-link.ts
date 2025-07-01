import { z } from 'zod/v4';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { DuplicatedShortLinkError } from './errors/duplicated-short-link';

const shortLinkInput = z.object({
  originalUrl: z.url().max(2048),
  shortUrl: z.url().max(255),
});

type ShortLinkInput = z.infer<typeof shortLinkInput>;

export async function createShortLink(
  input: ShortLinkInput,
): Promise<Either<DuplicatedShortLinkError, { id: string }>> {
  const { originalUrl, shortUrl } = shortLinkInput.parse(input);

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning({ insertedId: schema.links.id })
    .onConflictDoNothing({
      target: schema.links.shortUrl,
    });

  if (result.length === 0) {
    return makeLeft(new DuplicatedShortLinkError());
  }

  return makeRight({ id: result[0].insertedId });
}
