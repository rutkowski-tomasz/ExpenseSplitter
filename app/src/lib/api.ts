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
    throw new Error('Authentication failed');
  }
  
  return response;
}

// Settlements API
export const settlementsApi = {
  getAll: async (page: number = 1, pageSize: number = 10) =>
    apiCall(`/Settlements?Page=${page}&PageSize=${pageSize}`),
  
  getById: async (settlementId: string) =>
    apiCall(`/Settlements/${settlementId}`),
  
  create: async (name: string, participantNames: string[]) =>
    apiCall('/Settlements', {
      method: 'POST',
      body: JSON.stringify({ name, participantNames }),
    }),
  
  update: async (settlementId: string, name: string, participants: Array<{id: string | null, nickname: string}>) =>
    apiCall(`/Settlements/${settlementId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, participants }),
    }),
  
  delete: async (settlementId: string) =>
    apiCall(`/Settlements/${settlementId}`, { method: 'DELETE' }),
  
  join: async (inviteCode: string) =>
    apiCall('/Settlements/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    }),
  
  leave: async (settlementId: string) =>
    apiCall(`/Settlements/${settlementId}/leave`, { method: 'POST' }),
  
  getExpenses: async (settlementId: string) =>
    apiCall(`/Settlements/${settlementId}/expenses`),
  
  getReimbursement: async (settlementId: string) =>
    apiCall(`/Settlements/${settlementId}/reimbursement`),
};

// Expenses API
export const expensesApi = {
  create: async (expense: {
    name: string;
    paymentDate: string;
    settlementId: string;
    payingParticipantId: string;
    allocations: Array<{ participantId: string; value: number }>;
  }) =>
    apiCall('/Expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),
  
  getById: async (expenseId: string) =>
    apiCall(`/Expenses/${expenseId}`),
  
  update: async (expenseId: string, expense: {
    title: string;
    paymentDate: string;
    payingParticipantId: string;
    allocations: Array<{ id?: string; participantId: string; value: number }>;
  }) =>
    apiCall(`/Expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),
  
  delete: async (expenseId: string) =>
    apiCall(`/Expenses/${expenseId}`, { method: 'DELETE' }),
};