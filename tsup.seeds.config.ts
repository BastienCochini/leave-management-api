import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/db/runSeeds.ts'],
  outDir: 'dist/seeds',
  target: 'esnext',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
