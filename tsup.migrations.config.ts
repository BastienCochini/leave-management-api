import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/db/runMigrations.ts'],
  outDir: 'dist/migrations',
  target: 'esnext',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
