import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  dts: {
    generator: 'tsc',
    sourcemap: false,
  },
  deps: {
    neverBundle: [/^react(?:\/.*)?$/],
  },
  sourcemap: false,
  minify: false,
  clean: true,
  failOnWarn: true,
});
