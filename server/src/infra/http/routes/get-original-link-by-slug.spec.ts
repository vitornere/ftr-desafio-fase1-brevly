import type { FastifyInstance } from 'fastify';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { ShortLinkNotFoundError } from '@/app/functions/errors/short-link-not-found';
import * as getOriginalLinkBySlugModule from '@/app/functions/get-original-link-by-slug';
import { makeLeft, makeRight } from '@/shared/either';
import { buildServer } from '../app';

describe('GET /links/:slug', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
  });

  test('should return the original link', async () => {
    vi.spyOn(
      getOriginalLinkBySlugModule,
      'getOriginalLinkBySlug',
    ).mockResolvedValue(
      makeRight({
        originalUrl: 'https://www.google.com',
      }),
    );

    const response = await server.inject({
      method: 'GET',
      url: '/links/123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      originalUrl: 'https://www.google.com',
    });
  });

  test('should return a 404 if the short link is not found', async () => {
    vi.spyOn(
      getOriginalLinkBySlugModule,
      'getOriginalLinkBySlug',
    ).mockResolvedValue(makeLeft(new ShortLinkNotFoundError()));

    const response = await server.inject({
      method: 'GET',
      url: '/links/123',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Short link not found' });
  });
});
