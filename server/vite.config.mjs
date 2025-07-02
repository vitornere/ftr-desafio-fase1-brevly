import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    sequence: {
      setupFiles: ['src/app/functions/*.spec.ts'],
    },
  },
});
