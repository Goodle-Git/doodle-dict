// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  signup: (userData: SignupData) => Promise<void>;
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
        const userData = await authService.verifyToken();
        if (userData && userData.id) {  // Check specifically for id
          setUser(userData);
        } else {
          handleLogout();
        }
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

  const signup = async (userData: SignupData) => {
    const response = await authService.signup(userData);
    // Handle signup response same as login
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await authService.logout();
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
      logout: handleLogout,
      signup
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