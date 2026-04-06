import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],          // your main file
  format: ['esm'],       // generate both CommonJS & ESM
  dts: true,                     // generate types
  clean: true,                   // clean old dist
  external: ['zod', '@pixis/constants'], // never bundle these
});