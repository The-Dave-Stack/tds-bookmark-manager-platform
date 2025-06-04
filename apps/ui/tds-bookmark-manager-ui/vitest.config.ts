import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    reporters: [
      'default',
      ['json', { outputFile: './results/test-results.json' }],
      ['junit', { suiteName: 'UI tests' }]
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
        'src/main.tsx'
      ]
    }
  }
});