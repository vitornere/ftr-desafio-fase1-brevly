import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { createShortLink } from '@/app/functions/create-short-link';
import { DEFAULT_SHORT_URL_SLUG_REGEX } from '@/constants';
import { isRight, unwrapEither } from '@/shared/either';

export const createShortLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a short link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.url(),
          slug: z.string().max(255).regex(DEFAULT_SHORT_URL_SLUG_REGEX),
        }),
        response: {
          201: z.object({
            id: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, slug } = request.body;
      const result = await createShortLink({ originalUrl, slug });

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result));
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'DuplicatedShortLinkError':
          return reply
            .status(400)
            .send({ message: 'Short link already exists' });
        default:
          return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
};
