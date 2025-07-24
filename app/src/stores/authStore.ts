import { create } from 'zustand';
import { API_BASE_URL } from '~/config';
import { ok, err, Result } from 'neverthrow';

const AUTH_STORAGE_KEY = 'auth-storage';

export interface LoginResponse {
  accessToken: string;
}

export interface ApiError {
  title: string;
  status: number;
  detail: string;
}

type AuthState = {
  username: string | null;
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<Result<boolean, ApiError>>;
  register: (email: string, nickname: string, password: string) => Promise<Result<boolean, ApiError>>;
  logout: () => void;
  initializeAuth: () => void;
}

const getStoredAuth = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const setStoredAuth = (auth: { username: string | null; userId: string | null; token: string | null; isAuthenticated: boolean }) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const authCall = async (path: string, body: any) => {
  return await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  username: null,
  userId: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initializeAuth: async () => {
    const storedAuth = getStoredAuth();
    if (storedAuth && storedAuth.token && storedAuth.isAuthenticated) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/Users/me`, {
          headers: { Authorization: `Bearer ${storedAuth.token}` },
        });
        if (!response.ok) {
          set({ isInitialized: true });
          clearStoredAuth();
          return;
        }
        const user = await response.json();
        set({
          username: user.nickname,
          userId: user.id,
          token: storedAuth.token,
          isAuthenticated: true,
          isInitialized: true,
        });
        setStoredAuth({
          username: user.nickname,
          userId: user.id,
          token: storedAuth.token,
          isAuthenticated: true,
        });
      } catch {
        set({ isInitialized: true });
        clearStoredAuth();
      }
    } else {
      set({ isInitialized: true });
    }
  },

  login: async (email, password): Promise<Result<boolean, ApiError>> => {
    set({ isLoading: true });
    try {
      const response = await authCall('/api/v1/Users/login', { email, password });
      if (!response.ok) {
        set({ isLoading: false, isAuthenticated: false, token: null, username: null, userId: null });
        clearStoredAuth();
        return err(await response.json());
      }
      const data = await response.json();
      const token = data.accessToken;
      const meResponse = await fetch(`${API_BASE_URL}/api/v1/Users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meResponse.ok) {
        set({ isLoading: false, isAuthenticated: false, token: null, username: null, userId: null });
        clearStoredAuth();
        return err(await meResponse.json());
      }
      const user = await meResponse.json();
      const authData = {
        username: user.nickname,
        userId: user.id,
        token,
        isAuthenticated: true,
      };
      set({ ...authData, isLoading: false });
      setStoredAuth(authData);
      return ok(true);
    } catch (e: any) {
      set({ isLoading: false, isAuthenticated: false, token: null, username: null, userId: null });
      clearStoredAuth();
      return err({ title: 'Network error', detail: e.message, status: undefined });
    }
  },

  register: async (email, nickname, password): Promise<Result<boolean, ApiError>> => {
    set({ isLoading: true });
    try {
      const response = await authCall('/api/v1/Users/register', { email, nickname, password });
      if (!response.ok) {
        set({ isLoading: false, isAuthenticated: false, token: null, username: null, userId: null });
        clearStoredAuth();
        return err(await response.json());
      }
      set({ isLoading: false });
      return ok(true);
    } catch (e: any) {
      set({ isLoading: false, isAuthenticated: false, token: null, username: null, userId: null });
      clearStoredAuth();
      return err({ title: 'Network error', detail: e.message, status: undefined });
    }
  },

  logout: () => {
    set({ username: null, userId: null, token: null, isAuthenticated: false });
    clearStoredAuth();
    window.location.href = '/login';
  },
}));
