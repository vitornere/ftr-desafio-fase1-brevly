import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { getOriginalLinkByShort } from '@/app/functions/get-original-link-by-short';
import { DEFAULT_SHORT_URL_SLUG_REGEX } from '@/constants';
import { isRight, unwrapEither } from '@/shared/either';

export const getOriginalLinkByShortRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    '/links/:slug',
    {
      schema: {
        summary: 'Get original link by short url slug',
        tags: ['links'],
        params: z.object({
          slug: z.string().regex(DEFAULT_SHORT_URL_SLUG_REGEX),
        }),
        response: {
          200: z.object({
            originalUrl: z.url(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const result = await getOriginalLinkByShort({ slug });

      if (isRight(result)) {
        return reply.status(200).send(unwrapEither(result));
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortLinkNotFoundError':
          return reply.status(404).send({ error: error.message });
        default:
          return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
};
