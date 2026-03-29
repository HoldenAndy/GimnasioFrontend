import { getToken } from '@/lib/utils';

export const API_BASE_URL = 'http://localhost:8080/api/v1';

export function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
