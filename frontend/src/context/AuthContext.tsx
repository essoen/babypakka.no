'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User } from '@/types';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('babypakka_token');
    if (savedToken) {
      setToken(savedToken);
      api.getCurrentUser()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('babypakka_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

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
    <AuthContext.Provider value={{ user, token, isLoading, login: loginFn, register: registerFn, logout }}>
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
