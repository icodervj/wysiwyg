import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'WysiwygEditorCore',
      fileName: 'editor-core',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
