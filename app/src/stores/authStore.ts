import { create } from 'zustand';
import { API_BASE_URL } from '~/config';

type AuthState = {
  username: string | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, nickname: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      set({
        username: data.username,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false, isAuthenticated: false, token: null, username: null });
    }
  },

  register: async (email, nickname, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, password }),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      set({
        username: data.username,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false, isAuthenticated: false, token: null, username: null });
    }
  },

  logout: () => {
    set({ username: null, token: null, isAuthenticated: false, error: null });
  },
}))
