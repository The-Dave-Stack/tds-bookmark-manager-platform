import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    reporters: [
      'default',
      'html',
      ['json', { outputFile: './results/test-results.json' }],
      ['junit', { suiteName: 'UI tests' }]
    ],
    include:[
      'src/__tests__/**/*.{ts,tsx}'
    ],
    exclude: [
      'src/__tests__/setup.ts',
      'src/__tests__/test-utils.tsx',
      // Exclude specific test files
      'src/__tests__/App.test.tsx',
      'src/__tests__/components/auth/AuthRoutes.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vite*.config.ts',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
        'src/__tests__/**/*',
        'src/main.tsx',
        '**/*.js',
        '**/*.mjs',
        'src/api/types.ts'
      ]
    }
  }
});
