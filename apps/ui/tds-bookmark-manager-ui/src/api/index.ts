import { api as realApi } from './apiService';
import { mockApi } from './mockApiService';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export const api = useMockApi ? mockApi : realApi;