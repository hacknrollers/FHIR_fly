'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  abhaId: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (abhaId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
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
      console.log('AuthContext: Starting login process');
      // Use dummy login directly for development
      const { login: dummyLogin } = await import('@/services/api');
      const data = await dummyLogin(abhaId);
      
      console.log('AuthContext: Login data received:', data);
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem('fhir-fly-token', data.token);
      localStorage.setItem('fhir-fly-user', JSON.stringify(data.user));
      
      console.log('AuthContext: State updated, user:', data.user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
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
