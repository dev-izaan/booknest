'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook for using localStorage safely with Next.js
 * This hook handles SSR by checking for window object availability
 * and provides type safety for stored values
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Flag to track if component is mounted
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize the state on client-side only
  useEffect(() => {
    setIsLoaded(true);
    
    try {
      if (typeof window !== 'undefined') {
        // Get from local storage by key
        const item = localStorage.getItem(key);
        // Parse stored json or return initialValue if none
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage only if component is mounted and window is available
      if (isLoaded && typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
} 