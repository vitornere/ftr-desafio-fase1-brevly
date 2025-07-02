import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { createShortLink } from './create-short-link';
import { DuplicatedShortLinkError } from './errors/duplicated-short-link';

describe('createShortLink', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  it('should create a short link', async () => {
    const result = await createShortLink({
      originalUrl: 'https://www.google.com',
      slug: '123',
    });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result)).toEqual({ id: expect.any(String) });
  });

  it('should return a duplicated short link error if the short link already exists', async () => {
    await createShortLink({
      originalUrl: 'https://www.google.com',
      slug: '123',
    });
    const result = await createShortLink({
      originalUrl: 'https://www.google.com',
      slug: '123',
    });

    expect(isLeft(result)).toBe(true);
    expect(result.left).toBeInstanceOf(DuplicatedShortLinkError);
  });
});
