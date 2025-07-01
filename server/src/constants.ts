import { env } from './env';

export const DEFAULT_SHORT_URL_PREFIX =
  env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://brev.ly/';
export const DEFAULT_SHORT_URL_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;
