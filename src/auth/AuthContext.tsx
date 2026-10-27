import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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

interface SignupDetails extends Credentials {
  name: string;
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

const AuthContext = createContext<AuthContextValue | null>(null);

async function authRequest<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    credentials: 'same-origin',
    headers: body
      ? { 'Content-Type': 'application/json', 'X-Auth-Request': '1' }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(payload.error || `Authentication request failed (${response.status}).`);
  }
  return payload;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    authRequest<{ user: AuthUser | null }>('/api/auth/session')
      .then(({ user: sessionUser }) => {
        if (active) setUser(sessionUser);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Could not verify your session.');
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
    const result = await authRequest<{ user: AuthUser }>('/api/auth/login', credentials);
    setUser(result.user);
    setAuthDialogOpen(false);
  }, []);

  const signup = useCallback(async (details: SignupDetails) => {
    setError(null);
    const result = await authRequest<{ user: AuthUser }>('/api/auth/signup', details);
    setUser(result.user);
    setAuthDialogOpen(false);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await authRequest<void>('/api/auth/logout', {});
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
