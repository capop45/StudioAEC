import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { apiPost } from '../api/client';
import type { LoginResponse } from '../types';

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'studioaec_auth';

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, name: null, email: null, role: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, name: null, email: null, role: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadStored);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<LoginResponse, { email: string; password: string }>(
      '/api/auth/login',
      { email, password }
    );
    const next = { token: res.token, name: res.name, email: res.email, role: res.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ token: null, name: null, email: null, role: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.token,
      isAdmin: state.role === 'Admin',
      login,
      logout
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
