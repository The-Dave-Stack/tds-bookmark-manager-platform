import { api as realApi } from './apiService';
import { mockApi } from './mockApiService';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log(`Using mock API: ${useMockApi}`);

export const api = useMockApi ? mockApi : realApi;