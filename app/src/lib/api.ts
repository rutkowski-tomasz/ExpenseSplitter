import { API_BASE_URL } from '~/config';
import { useAuthStore } from '~/stores/authStore';

export async function apiCall(path: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  
  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }
  
  return response;
}
