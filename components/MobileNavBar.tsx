'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MobileNavBar({ activePage = '' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);
  
  const isActive = (path: string) => {
    if (activePage) {
      return activePage === path;
    }
    return pathname === path || pathname?.startsWith(`/${path}`);
  };
  
  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('bookTok_currentUser');
    
    // Redirect to login page
    router.push('/login');
    
    // Close modal
    setLogoutModalOpen(false);
  };
  
  return (
    <div className={`mobile-nav-bar transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <Link href="/feed" className={`mobile-nav-item ${isActive('feed') || isActive('dashboard') ? 'text-[var(--accent-color)]' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link href="/discover" className={`mobile-nav-item ${isActive('discover') ? 'text-[var(--accent-color)]' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs mt-1">Discover</span>
      </Link>
      
      <button 
        onClick={() => setCreateModalOpen(true)} 
        className="mobile-nav-item relative"
        aria-label="Create new content"
      >
        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white p-2 rounded-full shadow-md transform -translate-y-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-xs">Create</span>
      </button>
      
      <Link href="/messages" className={`mobile-nav-item ${isActive('messages') ? 'text-[var(--accent-color)]' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-xs mt-1">Messages</span>
      </Link>
      
      <button 
        onClick={() => setLogoutModalOpen(true)} 
        className={`mobile-nav-item ${isActive('profile') ? 'text-[var(--accent-color)]' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs mt-1">Profile</span>
      </button>

      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4 animate-fadeIn">
          <div className="bg-[var(--card-bg)] rounded-t-xl w-full max-w-md p-6 animate-bookOpen">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-[var(--primary-dark)] p-2 rounded-full hover:bg-[var(--primary-light)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <Link href="/create-post" onClick={() => setCreateModalOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Book Post</h4>
                  <p className="text-sm text-[var(--primary-dark)]">Share photos, videos or quotes</p>
                </div>
              </Link>
              
              <Link href="/microblog" onClick={() => setCreateModalOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Microblog Post</h4>
                  <p className="text-sm text-[var(--primary-dark)]">Share quick thoughts about books</p>
                </div>
              </Link>
              
              <Link href="/messages" onClick={() => setCreateModalOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Start a Conversation</h4>
                  <p className="text-sm text-[var(--primary-dark)]">Chat with other book lovers</p>
                </div>
              </Link>
              
              <Link href="/bookshelf" onClick={() => setCreateModalOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Add to Bookshelf</h4>
                  <p className="text-sm text-[var(--primary-dark)]">Update your reading status</p>
                </div>
              </Link>
              
              <Link href="/create-list" onClick={() => setCreateModalOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Create Reading List</h4>
                  <p className="text-sm text-[var(--primary-dark)]">Curate a collection of books</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-sm p-6 animate-bookOpen">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Sign Out</h3>
              <p className="text-[var(--text-secondary)]">Are you sure you want to sign out?</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-2 px-4 border border-[var(--card-border)] rounded-md text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--background)] focus:outline-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 