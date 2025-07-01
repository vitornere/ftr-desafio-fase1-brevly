import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { deleteShortLink } from '@/app/functions/delete-short-link';
import { DEFAULT_SHORT_URL_SLUG_REGEX } from '@/constants';
import { isRight, unwrapEither } from '@/shared/either';

export const deleteShortLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/links/:slug',
    {
      schema: {
        summary: 'Delete a short link',
        tags: ['links'],
        params: z.object({
          slug: z.string().regex(DEFAULT_SHORT_URL_SLUG_REGEX),
        }),
        response: {
          204: z.null(),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const result = await deleteShortLink(slug);

      if (isRight(result)) {
        return reply.status(204).send();
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
