import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist/src',
  target: 'esnext',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  watch: process.env.NODE_ENV === 'development',
  minify: process.env.NODE_ENV === 'production',
});
