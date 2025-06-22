/// <reference types='vitest' />
import { PluginOption, defineConfig, loadEnv } from 'vite';

import { join } from 'path';
import react from '@vitejs/plugin-react';

/**
 * A self-contained Vite plugin to load environment variables
 * and inject them into a global window.TDS_CONFIG object in index.html.
 * This makes environment-specific configurations available to the client-side code.
 * @param {string} mode - The current Vite mode (e.g., 'development', 'production').
 * @returns {PluginOption} The Vite plugin object.
 */
function tdsConfigInjectorPlugin(mode: string): PluginOption {
  // Load environment variables from the appropriate .env file (e.g., .env.development).
  // The third argument '' ensures that all variables are loaded, not just those with a VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Build the configuration object that will be attached to the window.
  // This can be easily extended with more variables in the future.
  const configForWindow: Record<string, string | undefined> = {
    API_URL: env.API_URL,
    // Add other environment variables here if needed, for example:
    // ANOTHER_VAR: env.ANOTHER_VAR,
  };

  return {
    name: 'tds-config-injector-plugin',
    transformIndexHtml(html) {
      // Safely stringify the configuration object to ensure it's valid JavaScript.
      // This prevents issues with quotes or special characters in the variables.
      const configScript = `
        <script>
          window.TDS_CONFIG = ${JSON.stringify(configForWindow)};
        </script>
      `;

      // Inject the script into the <head> of the HTML document before the closing tag.
      return html.replace('</head>', `${configScript}\n</head>`);
    },
  };
}

export default defineConfig(({ mode }) => ({
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
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/test-output/**',
        '../../../.nx/cache/**',
        '../../../apps/backend/**',
      ],
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
  plugins: [react(), tdsConfigInjectorPlugin(mode)],
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
