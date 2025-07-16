/**
 * index.ts
 *
 * Purpose:
 * - Exports the appropriate API service based on the `VITE_USE_MOCK_API` environment variable.
 * - Allows switching between a real backend API and a mock API for development and testing.
 *
 * Logic Overview:
 * 1. Imports both the `realApi` (from `apiService.ts`) and `mockApi` (from `mockApiService.ts`).
 * 2. Checks the value of `import.meta.env.VITE_USE_MOCK_API`.
 * 3. Exports either `mockApi` or `realApi` as `api` based on the environment variable.
 * 4. Logs whether the mock API is being used for clarity during development.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { api as realApi } from './apiService';
import { mockApi } from './mockApiService';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log(`Using mock API: ${useMockApi}`);

export const api = useMockApi ? mockApi : realApi;
