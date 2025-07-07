import type { FastifyInstance } from 'fastify';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import * as listShortLinksModule from '@/app/functions/list-short-links';
import { makeRight } from '@/shared/either';
import { generateFakeLink } from '@/tests/utils/links-fixtures';
import { buildServer } from '../app';

describe('GET /links', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
  });

  test('should return all links', async () => {
    const links = Array.from({ length: 3 }, generateFakeLink).map((link) => ({
      originalUrl: link.originalUrl,
      slug: link.slug,
      clicks: link.clicks,
      createdAt: link.createdAt,
    }));

    vi.spyOn(listShortLinksModule, 'listShortLinks').mockResolvedValue(
      makeRight(links),
    );

    const response = await server.inject({
      method: 'GET',
      url: '/links',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      links.map((link) => ({
        originalUrl: link.originalUrl,
        slug: link.slug,
        clicks: link.clicks,
        createdAt: link.createdAt.toISOString(),
      })),
    );
  });
});
