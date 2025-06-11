import { mockApi } from './mockApiService';
import { api as realApi } from './apiService';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export const api = useMockApi ? mockApi : realApi;