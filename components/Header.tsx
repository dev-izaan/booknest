'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

type HeaderProps = {
  isLoggedIn?: boolean;
  username?: string;
}

export default function Header({ isLoggedIn = false, username }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Add event listener for scroll
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      
      // Check initial scroll position
      handleScroll();
      
      // Cleanup
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const isActivePath = (path: string) => {
    return pathname === path || pathname?.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 main-navigation z-40 h-[var(--nav-height)] transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-[var(--accent-color)] hidden sm:block relative">
              BookTok
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary-color)]"></span>
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--accent-color)] sm:hidden relative">
              BT
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary-color)]"></span>
            </span>
          </Link>

          {/* Search - Mobile Hidden, Desktop Visible */}
          <div className="hidden md:flex relative w-64 mx-4">
            <input 
              type="text" 
              placeholder="Search books, readers..." 
              className="bg-[var(--primary-light)] dark:bg-[var(--card-bg)] text-[var(--foreground)] dark:text-[var(--foreground)] rounded-full py-1.5 px-4 w-full text-sm focus:outline-none border border-[var(--card-border)] focus:border-[var(--accent-color)]"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--primary-color)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Icons */}
          <nav className="hidden md:flex items-center space-x-5">
            <Link 
              href="/dashboard" 
              className={`nav-link ${isActivePath('/dashboard') ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1">Home</span>
              </div>
            </Link>
            <Link 
              href="/discover" 
              className={`nav-link ${isActivePath('/discover') ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs mt-1">Discover</span>
              </div>
            </Link>
            <Link 
              href="/create-post" 
              className="create-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <Link 
              href="/messages" 
              className={`nav-link ${isActivePath('/messages') ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-xs mt-1">Messages</span>
              </div>
            </Link>
            <Link 
              href="/bookshelf" 
              className={`nav-link ${isActivePath('/bookshelf') ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs mt-1">Bookshelf</span>
              </div>
            </Link>
            <ThemeToggle />
            <Link href="/profile" className="nav-link">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] dark:bg-[var(--primary-light)] flex items-center justify-center overflow-hidden border border-[var(--primary-color)] shadow-sm">
                {username ? username[0].toUpperCase() : 'D'}
              </div>
            </Link>
          </nav>

          {/* Mobile Icons - Always visible on small screens */}
          <div className="flex md:hidden items-center space-x-3">
            <button className="text-[var(--primary-dark)] dark:text-[var(--primary-color)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 