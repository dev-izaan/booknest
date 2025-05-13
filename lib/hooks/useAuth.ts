'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';

type User = {
  name: string;
  email: string;
  username?: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
};

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our SSR-safe localStorage hook
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, hardcode a simple check
      // In a real app, this would be an API call
      if (email === 'demo@booknest.com' && password === 'password') {
        const userData = {
          name: 'Demo User',
          email: 'demo@booknest.com',
          username: 'demouser',
        };
        
        setUser(userData);
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        name: userData.name,
        email: userData.email,
        username: userData.username,
      });
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  return {
    isLoggedIn,
    user,
    isLoading,
    login,
    register,
    logout,
  };
} 