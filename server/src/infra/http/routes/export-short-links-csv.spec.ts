import type { FastifyInstance } from 'fastify';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import * as exportShortLinksCsvModule from '@/app/functions/export-short-links-csv';
import { makeRight } from '@/shared/either';
import { buildServer } from '../app';

describe('POST /links/export', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
  });

  test('should export short links as CSV', async () => {
    vi.spyOn(
      exportShortLinksCsvModule,
      'exportShortLinksCsv',
    ).mockResolvedValue(
      makeRight({
        exportUrl: 'https://example.com/export.csv',
      }),
    );

    const response = await server.inject({
      method: 'POST',
      url: '/links/export',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      exportUrl: 'https://example.com/export.csv',
    });
  });
});
