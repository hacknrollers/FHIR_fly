'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LoginResponse } from '@/lib/api';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  token: string | null;
  login: (abhaId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('fhir-fly-token');
    const storedUser = localStorage.getItem('fhir-fly-user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (abhaId: string) => {
    try {
      const { login: loginApi } = await import('@/lib/api');
      const response = await loginApi(abhaId);
      
      setToken(response.token);
      setUser(response.user);
      
      // Store in localStorage
      localStorage.setItem('fhir-fly-token', response.token);
      localStorage.setItem('fhir-fly-user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fhir-fly-token');
    localStorage.removeItem('fhir-fly-user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
