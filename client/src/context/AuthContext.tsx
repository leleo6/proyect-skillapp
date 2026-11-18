import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  quickLogin: (role: 'admin' | 'cajero') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('actinvent_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        // By default, set a guest cashier session if not logged in
        setIsLoading(false);
        return;
      }
      try {
        const { user } = await api.getCurrentUser();
        setUser(user);
      } catch {
        localStorage.removeItem('actinvent_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('actinvent_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`¡Bienvenido ${data.user.name}! Rol: ${data.user.role.toUpperCase()}`, 'success');
    } catch (err: unknown) {
      showToast((err as Error).message, 'error');
      throw err;
    }
  }, [showToast]);

  const quickLogin = useCallback(async (role: 'admin' | 'cajero') => {
    const creds = role === 'admin'
      ? { email: 'admin@actinvent.com', pass: 'admin123' }
      : { email: 'cajero@actinvent.com', pass: 'cajero123' };
    
    await login(creds.email, creds.pass);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('actinvent_token');
    setToken(null);
    setUser(null);
    showToast('Sesión cerrada. Modo consulta activo.', 'info');
  }, [showToast]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
