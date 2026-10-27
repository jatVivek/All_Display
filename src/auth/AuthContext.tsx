import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storeManager } from '../services/storeManager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  phone?: string;
}

interface Credentials {
  email: string;
  password: string;
}

export interface SignupDetails extends Credentials {
  name: string;
  phone?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<void>;
  signup: (details: SignupDetails) => Promise<void>;
  logout: () => Promise<void>;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  isAuthDialogOpen: boolean;
}

const CUSTOMER_TOKEN_KEY = 'alldisplay_customer_token';
const CUSTOMER_USER_KEY = 'alldisplay_customer_user';

const AuthContext = createContext<AuthContextValue | null>(null);

async function authRequest<T>(path: string, body?: object): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(CUSTOMER_TOKEN_KEY) : null;
  const headers: Record<string, string> = {
    'X-Auth-Request': '1',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['X-Customer-Token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    credentials: 'same-origin',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(payload.error || `Authentication request failed (${response.status}).`);
  }
  return payload;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(CUSTOMER_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem(CUSTOMER_TOKEN_KEY) : null;

    authRequest<{ user: AuthUser | null }>('/api/auth/session')
      .then(({ user: sessionUser }) => {
        if (!active) return;
        if (sessionUser) {
          setUser(sessionUser);
          try {
            localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(sessionUser));
          } catch {}
          void storeManager.saveRegisteredCustomer(sessionUser);
        } else if (!token) {
          setUser(null);
          try {
            localStorage.removeItem(CUSTOMER_USER_KEY);
          } catch {}
        }
      })
      .catch((requestError: unknown) => {
        if (active && !user) {
          setError(requestError instanceof Error ? requestError.message : 'Could not verify your session.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setError(null);
    const result = await authRequest<{ user: AuthUser; token?: string }>('/api/auth/login', credentials);
    setUser(result.user);
    if (result.token) {
      try {
        localStorage.setItem(CUSTOMER_TOKEN_KEY, result.token);
      } catch {}
    }
    try {
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(result.user));
    } catch {}
    await storeManager.saveRegisteredCustomer(result.user);
    setAuthDialogOpen(false);
  }, []);

  const signup = useCallback(async (details: SignupDetails) => {
    setError(null);
    const result = await authRequest<{ user: AuthUser; token?: string }>('/api/auth/signup', details);
    setUser(result.user);
    if (result.token) {
      try {
        localStorage.setItem(CUSTOMER_TOKEN_KEY, result.token);
      } catch {}
    }
    try {
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(result.user));
    } catch {}
    await storeManager.saveRegisteredCustomer(result.user, details.phone);
    setAuthDialogOpen(false);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authRequest<void>('/api/auth/logout', {});
    } catch {}
    try {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_USER_KEY);
    } catch {}
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    signup,
    logout,
    openAuthDialog: () => setAuthDialogOpen(true),
    closeAuthDialog: () => setAuthDialogOpen(false),
    isAuthDialogOpen,
  }), [user, isLoading, error, login, signup, logout, isAuthDialogOpen]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
