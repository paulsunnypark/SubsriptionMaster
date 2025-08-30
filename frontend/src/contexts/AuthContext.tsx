'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 토큰이 저장되어 있는지 확인
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      apiClient.setToken(token);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.warn('사용자 데이터 파싱 실패:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.profile();
      if (response.ok && response.data) {
        setUser(response.data as any);
      } else {
        // 토큰이 유효하지 않으면 제거
        localStorage.removeItem('auth_token');
        apiClient.clearToken();
      }
    } catch (error) {
      console.warn('Profile API 호출 실패, 토큰 제거:', error);
      localStorage.removeItem('auth_token');
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.ok && (response.data as any)?.accessToken) {
        const token = (response.data as any).accessToken;
        localStorage.setItem('auth_token', token);
        apiClient.setToken(token);
        
        if ((response.data as any).user) {
          const userData = (response.data as any).user;
          setUser(userData);
          localStorage.setItem('user_data', JSON.stringify(userData));
        } else {
          // 백엔드가 user를 포함하지 않는 경우 임시 사용자 데이터 생성
          const tempUser = { email, name: email.split('@')[0] };
          setUser(tempUser);
          localStorage.setItem('user_data', JSON.stringify(tempUser));
        }
        return {};
      } else {
        return { error: response.error || '로그인에 실패했습니다.' };
      }
    } catch (error) {
      return { error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ email, password, name });
      
      if (response.ok && (response.data as any)?.accessToken) {
        const token = (response.data as any).accessToken;
        localStorage.setItem('auth_token', token);
        apiClient.setToken(token);
        if ((response.data as any).user) {
          setUser((response.data as any).user);
        } else {
          await fetchUser();
        }
        return {};
      } else {
        return { error: response.error || '회원가입에 실패했습니다.' };
      }
    } catch (error) {
      return { error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // 로그아웃 API 실패해도 클라이언트에서는 로그아웃 처리
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      apiClient.clearToken();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
