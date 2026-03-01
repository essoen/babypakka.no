'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User } from '@/types';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;

  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('babypakka_token');
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('babypakka_token') !== null;
  });

  // On mount, validate existing token by fetching current user
  useEffect(() => {
    if (!token) return;
    api.getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('babypakka_token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loginFn = useCallback(async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem('babypakka_token', response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const registerFn = useCallback(async (email: string, password: string, name: string) => {
    const response = await api.register(email, password, name);
    localStorage.setItem('babypakka_token', response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('babypakka_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login: loginFn, register: registerFn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
