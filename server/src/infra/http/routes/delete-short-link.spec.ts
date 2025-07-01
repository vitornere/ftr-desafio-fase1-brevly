import type { FastifyInstance } from 'fastify';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import * as deleteShortLinkModule from '@/app/functions/delete-short-link';
import { ShortLinkNotFoundError } from '@/app/functions/errors/short-link-not-found';
import { makeLeft, makeRight } from '@/shared/either';
import { buildServer } from '../app';

describe('DELETE /links/:slug', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
  });

  test('should delete a short link', async () => {
    vi.spyOn(deleteShortLinkModule, 'deleteShortLink').mockResolvedValue(
      makeRight(null),
    );

    const response = await server.inject({
      method: 'DELETE',
      url: '/links/123',
    });

    expect(response.statusCode).toBe(204);
  });

  test('should return a 404 if the short link is not found', async () => {
    vi.spyOn(deleteShortLinkModule, 'deleteShortLink').mockResolvedValue(
      makeLeft(new ShortLinkNotFoundError()),
    );

    const response = await server.inject({
      method: 'DELETE',
      url: '/links/123',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: 'Short link not found',
    });
  });
});
