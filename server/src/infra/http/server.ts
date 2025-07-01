import { buildServer } from './app';

buildServer()
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then((_) => {
    console.log('Server is running on port 3333');
  });
