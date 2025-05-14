'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setIsLoading(true);

    // Simple email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simple password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Get registered users from localStorage or create empty array
      const usersString = localStorage.getItem('bookTok_users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Find user with matching email
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        setError('No account found with this email');
        setIsLoading(false);
        return;
      }
      
      // Check password (in a real app, this would use proper hashing)
      if (user.password !== password) {
        setError('Invalid password');
        setIsLoading(false);
        return;
      }
      
      // Create current user object (omitting password)
      const currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      };
      
      // Store in localStorage
      localStorage.setItem('bookTok_currentUser', JSON.stringify(currentUser));
      
      // Redirect to feed
      router.push('/feed');
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login - for development
  const handleDemoLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create a demo user if it doesn't exist
    const usersString = localStorage.getItem('bookTok_users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    const demoEmail = 'demo@booktok.com';
    
    if (!users.some((u: any) => u.email === demoEmail)) {
      const demoUser = {
        id: `user_${Date.now()}`,
        username: 'demouser',
        email: demoEmail,
        password: 'password123',
        avatar: '',
        createdAt: new Date().toISOString()
      };
      
      users.push(demoUser);
      localStorage.setItem('bookTok_users', JSON.stringify(users));
    }
    
    // Set form values for demo login
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[var(--text-primary)]">
            Sign in to BookTok
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Or{' '}
            <Link href="/register" className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/90">
              create a new account
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
              <label htmlFor="email-address" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-[var(--card-border)] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-primary)]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/90">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <button
              onClick={handleDemoLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-[var(--card-border)] text-sm font-medium rounded-md text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
            >
              Use demo account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 