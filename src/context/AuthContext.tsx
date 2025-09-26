import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
axios.defaults.baseURL = API_BASE_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [loading, setLoading] = useState(false);

  // Set axios authorization header when token changes
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('access_token', accessToken);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('access_token');
    }
  }, [accessToken]);

  // Get user profile on mount if token exists
  useEffect(() => {
    if (accessToken && !user) {
      getProfile();
    }
  }, [accessToken]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      setAccessToken(access_token);
      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/register', { name, email, password });
      const { access_token, user: userData } = response.data;
      
      setAccessToken(access_token);
      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = (): void => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = (): void => {
    setUser(null);
    setAccessToken(null);
  };

  const getProfile = async (): Promise<void> => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      // If profile fetch fails, clear token
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};