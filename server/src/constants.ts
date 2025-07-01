import { env } from './env';

export const DEFAULT_SHORT_URL_PREFIX =
  env.NODE_ENV === 'production' ? 'https://brev.ly/' : 'http://localhost:3000/';
export const DEFAULT_SHORT_URL_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;
