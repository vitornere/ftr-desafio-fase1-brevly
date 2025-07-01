import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { getOriginalLinkByShort } from '@/app/functions/get-original-link-by-short';
import {
  DEFAULT_SHORT_URL_PREFIX,
  DEFAULT_SHORT_URL_SLUG_REGEX,
} from '@/constants';
import { isRight, unwrapEither } from '@/shared/either';

export const getOriginalLinkByShortRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    '/links/:shortUrlSlug',
    {
      schema: {
        summary: 'Get original link by short url slug',
        tags: ['links'],
        params: z.object({
          shortUrlSlug: z.string().refine(
            (url) => {
              if (!url.startsWith(DEFAULT_SHORT_URL_PREFIX)) return false;

              const slug = url.replace(DEFAULT_SHORT_URL_PREFIX, '');
              return DEFAULT_SHORT_URL_SLUG_REGEX.test(slug);
            },
            {
              message: `A URL encurtada deve começar com "${DEFAULT_SHORT_URL_PREFIX}" e conter apenas letras, números, hífens ou underlines após o prefixo.`,
            },
          ),
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
      const { shortUrlSlug } = request.params;

      const result = await getOriginalLinkByShort({
        shortUrl: `${DEFAULT_SHORT_URL_PREFIX}${shortUrlSlug}`,
      });

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
