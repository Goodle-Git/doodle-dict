// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface User {
  username: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!token && !!user;
  });

  useEffect(() => {
    // Verify token on mount and periodically
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const userData = await auth.verifyToken(token);
        setUser(userData);
      } catch (error) {
        console.error('Token verification failed:', error);
        handleLogout();
      }
    };

    verifyToken();
    // Check token every 5 minutes
    const interval = setInterval(verifyToken, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await auth.logout(token);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
    // Always clean up local state, even if server logout fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      user,
      login,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};