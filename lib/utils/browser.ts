/**
 * Safely check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safe wrapper for accessing browser-only APIs
 * @param callback Function to execute if in browser environment
 * @param fallbackValue Value to return if not in browser
 */
export function withBrowser<T>(callback: () => T, fallbackValue: T): T {
  if (isBrowser) {
    return callback();
  }
  return fallbackValue;
}

/**
 * Safely access localStorage with proper typing
 */
export const safeLocalStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    return withBrowser(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
      } catch (e) {
        console.error(`Error reading from localStorage: ${e}`);
        return defaultValue;
      }
    }, defaultValue);
  },
  
  setItem: <T>(key: string, value: T): void => {
    withBrowser(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Error writing to localStorage: ${e}`);
      }
    }, undefined);
  },
  
  removeItem: (key: string): void => {
    withBrowser(() => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing from localStorage: ${e}`);
      }
    }, undefined);
  }
}; 