// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

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
        const response = await fetch('http://localhost:8000/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Token is invalid or expired
          handleLogout();
        }
      } catch (error) {
        console.error('Token verification failed:', error);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add token to all API requests
  useEffect(() => {
    const interceptor = (config: RequestInit): RequestInit => {
      if (token) {
        return {
          ...config,
          headers: {
            ...config.headers,
            'Authorization': `Bearer ${token}`
          }
        };
      }
      return config;
    };

    // Add interceptor to global fetch
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      const config = interceptor(init || {});
      return originalFetch(input, config);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: true,
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