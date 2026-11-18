import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        tateru: `${root}index.html`,
        kowasu: `${root}hack.html`,
        leisure: `${root}leisure.html`,
      },
    },
  },
});
