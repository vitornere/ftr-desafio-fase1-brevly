import type { FastifyInstance } from 'fastify';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import * as createShortLinkModule from '@/app/functions/create-short-link';
import { DuplicatedShortLinkError } from '@/app/functions/errors/duplicated-short-link';
import { makeLeft, makeRight } from '@/shared/either';
import { buildServer } from '../app';

describe('POST /links', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
  });

  test('should create a short link', async () => {
    vi.spyOn(createShortLinkModule, 'createShortLink').mockResolvedValue(
      makeRight({
        id: 'mocked-id',
      }),
    );

    const response = await server.inject({
      method: 'POST',
      url: '/links',
      body: {
        originalUrl: 'https://www.google.com',
        slug: '123',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      id: 'mocked-id',
    });
  });

  test('should return 400 if the url is not valid', async () => {
    vi.spyOn(createShortLinkModule, 'createShortLink').mockResolvedValue(
      makeLeft(new DuplicatedShortLinkError()),
    );

    const response = await server.inject({
      method: 'POST',
      url: '/links',
      body: {
        originalUrl: 'https://www.google.com',
        slug: '123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Short link already exists',
    });
  });
});
