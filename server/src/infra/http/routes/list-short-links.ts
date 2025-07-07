import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { listShortLinks } from '@/app/functions/list-short-links';
import { unwrapEither } from '@/shared/either';

export const listShortLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'List all short links',
        tags: ['links'],
        response: {
          200: z.array(
            z.object({
              originalUrl: z.url(),
              slug: z.string(),
              clicks: z.number(),
              createdAt: z.date(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const result = await listShortLinks();

      const links = unwrapEither(result);

      return reply.status(200).send(links);
    },
  );
};
