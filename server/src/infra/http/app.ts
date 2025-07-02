import { fastifyCors } from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createShortLinkRoute } from './routes/create-short-link';
import { deleteShortLinkRoute } from './routes/delete-short-link';
import { getOriginalLinkBySlugRoute } from './routes/get-original-link-by-slug';
import { listShortLinksRoute } from './routes/list-short-links';
import { transformSwaggerSchema } from './transform-swagger-schema';

export function buildServer() {
  const server = fastify();

  server.setSerializerCompiler(serializerCompiler);
  server.setValidatorCompiler(validatorCompiler);

  server.setErrorHandler((error, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        message: 'Validation error.',
        errors: error.validation,
      });
    }

    console.error(error);

    return reply.code(500).send({
      message: 'Internal server error.',
    });
  });

  server.register(fastifyCors, {
    origin: '*',
  });
  server.register(fastifyMultipart);
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Brev.ly API',
        version: '1.0.0',
      },
    },
    transform: transformSwaggerSchema,
  });

  server.register(createShortLinkRoute);
  server.register(listShortLinksRoute);
  server.register(deleteShortLinkRoute);
  server.register(getOriginalLinkBySlugRoute);

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  return server;
}
