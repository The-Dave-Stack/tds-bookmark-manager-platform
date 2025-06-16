/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { join } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/ui/tds-bookmark-manager-ui',
  server: {
    port: 4200,
    host: 'localhost',
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@tds/tds-bm-common': join(__dirname, '../../../libs/tds-bm-common/dist'),
    },
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    //watch: false,
    reporters: ['default', 'html'],
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'src/__tests__/setup.ts',
      'src/__tests__/test-utils.tsx',
      // Exclude specific test files
      'src/__tests__/App.test.tsx',
      'src/__tests__/components/auth/AuthRoutes.test.tsx',
    ],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      exclude: [
        'node_modules/',
        'vite*.config.ts',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
        'src/__tests__/**/*',
        'src/main.tsx',
        '**/*.js',
        '**/*.mjs',
        'src/api/types.ts',
        'src/api/apiService.ts',
      ],
    },
  },
}));
