import { create } from 'zustand';
import { API_BASE_URL } from '~/config';

const AUTH_STORAGE_KEY = 'auth-storage';

type AuthState = {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, nickname: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredAuth = (auth: { username: string | null; token: string | null; isAuthenticated: boolean }) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // Handle localStorage being unavailable
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Handle localStorage being unavailable
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  username: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initializeAuth: () => {
    const storedAuth = getStoredAuth();
    if (storedAuth && storedAuth.token && storedAuth.isAuthenticated) {
      set({
        username: storedAuth.username,
        token: storedAuth.token,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

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
      
      const authData = {
        username: JSON.parse(atob(data.accessToken.split('.')[1])).preferred_username,
        token: data.accessToken,
        isAuthenticated: true,
      };
      
      set({
        ...authData,
        isLoading: false,
        error: null,
      });
      
      setStoredAuth(authData);
    } catch (e: any) {
      set({ error: e.message, isLoading: false, isAuthenticated: false, token: null, username: null });
      clearStoredAuth();
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
      
      const authData = {
        username: data.username,
        token: data.token,
        isAuthenticated: true,
      };
      
      set({
        ...authData,
        isLoading: false,
        error: null,
      });
      
      setStoredAuth(authData);
    } catch (e: any) {
      set({ error: e.message, isLoading: false, isAuthenticated: false, token: null, username: null });
      clearStoredAuth();
    }
  },

  logout: () => {
    set({ username: null, token: null, isAuthenticated: false, error: null });
    clearStoredAuth();
    window.location.href = '/';
  },
}));
