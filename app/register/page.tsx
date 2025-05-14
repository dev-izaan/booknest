'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generatePlaceholderImage } from '@/lib/services/image-service';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const user = localStorage.getItem('bookTok_currentUser');
    if (user) {
      router.push('/feed');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);

    try {
      // Get existing users from localStorage or initialize empty array
      const usersString = localStorage.getItem('bookTok_users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Check if email is already in use
      if (users.some((user: any) => user.email === email)) {
        setError('Email is already in use. Please try another email.');
        setIsLoading(false);
        return;
      }
      
      // Check if username is already taken
      if (users.some((user: any) => user.username === username)) {
        setError('Username is already taken. Please choose another username.');
        setIsLoading(false);
        return;
      }
      
      // Generate avatar placeholder
      const avatar = generatePlaceholderImage(username, 100, 100);
      
      // Create new user
      const userId = `user_${Date.now()}`;
      const newUser = {
        id: userId,
        name,
        email,
        username,
        password, // Note: In a real app, this would be securely hashed
        avatar,
        createdAt: new Date().toISOString(),
        bio: '',
        following: [],
        followers: [],
        booksRead: 0,
        reviewsPosted: 0
      };
      
      // Add to users array
      users.push(newUser);
      
      // Save to localStorage
      localStorage.setItem('bookTok_users', JSON.stringify(users));
      
      // Create current user object (omitting password)
      const currentUser = {
        id: userId,
        username,
        email,
        avatar
      };
      
      // Set as current user
      localStorage.setItem('bookTok_currentUser', JSON.stringify(currentUser));
      
      // Redirect to feed page
      router.push('/feed');
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[var(--text-primary)]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/90">
              Sign in
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-sm text-center text-[var(--text-secondary)]">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/90">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/90">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 