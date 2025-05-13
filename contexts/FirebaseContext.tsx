'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import app from '@/lib/firebase';
import auth, { onAuthStateChange } from '@/lib/services/firebase-auth';
import db from '@/lib/services/firestore';
import storage from '@/lib/services/storage';

// Define context types
type FirebaseContextType = {
  app: typeof app;
  auth: typeof auth;
  db: typeof db;
  storage: typeof storage;
  user: User | null;
  loading: boolean;
};

// Create the context with a default value
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Provider component
export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    app,
    auth,
    db,
    storage,
    user,
    loading,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext; 