'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI, UsersAPI, BooksAPI } from '@/lib/api';

// Define types for our context
type User = {
  id?: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  // Add other user properties as needed
};

type AppContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  recentlyViewedBooks: any[];
  addToRecentlyViewed: (book: any) => void;
  notifications: any[];
  markNotificationAsRead: (id: string) => void;
};

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  recentlyViewedBooks: [],
  addToRecentlyViewed: () => {},
  notifications: [],
  markNotificationAsRead: () => {},
});

// Create a custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', message: 'Jane Austen sent you a message', read: false, timestamp: new Date().toISOString() },
    { id: '2', message: 'Ernest Hemingway liked your review', read: false, timestamp: new Date().toISOString() },
    { id: '3', message: 'Virginia Woolf shared a book with you', read: true, timestamp: new Date().toISOString() },
  ]);
  const [isMounted, setIsMounted] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    setIsMounted(true);
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would check for an active session
        const currentUser = await AuthAPI.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Load recently viewed books from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBooks = localStorage.getItem('recentlyViewedBooks');
      if (storedBooks) {
        try {
          setRecentlyViewedBooks(JSON.parse(storedBooks));
        } catch (error) {
          console.error('Failed to parse recently viewed books:', error);
        }
      }
    }
  }, [isMounted]);

  // Authentication functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.register(userData);
      if (response.success) {
        // Auto-login after registration
        await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Recently viewed books function
  const addToRecentlyViewed = (book: any) => {
    setRecentlyViewedBooks(prevBooks => {
      // Remove duplicates and add new book at the beginning
      const updatedBooks = [
        book,
        ...prevBooks.filter(b => b.id !== book.id)
      ].slice(0, 5); // Keep only the 5 most recent
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentlyViewedBooks', JSON.stringify(updatedBooks));
      }
      
      return updatedBooks;
    });
  };

  // Notification functions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Provide the context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    recentlyViewedBooks,
    addToRecentlyViewed,
    notifications,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 