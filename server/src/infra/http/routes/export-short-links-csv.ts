import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { exportShortLinksCsv } from '@/app/functions/export-short-links-csv';
import { unwrapEither } from '@/shared/either';

export const exportShortLinksCsvRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.post(
    '/links/export',
    {
      schema: {
        summary: 'Export short links as CSV',
        tags: ['links'],
        response: {
          200: z.object({
            exportUrl: z.url(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      const result = await exportShortLinksCsv();

      const { exportUrl } = unwrapEither(result);

      return reply.status(200).send({ exportUrl });
    },
  );
};
