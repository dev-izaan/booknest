'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MobileNavBar from '@/components/MobileNavBar';
import StoriesBar from '@/components/StoriesBar';
import { useAuth } from '@/lib/hooks/useAuth';

// Mock Data
const mockFeed = [
  {
    id: 1,
    author: {
      name: 'Jane Austen',
      username: 'janeausten',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    content: 'Just finished reading "The Midnight Library" by Matt Haig. Absolutely loved it! A beautiful exploration of regret, possibility, and what makes life worth living. #bookrecommendation',
    image: 'https://picsum.photos/id/24/600/400',
    book: {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://picsum.photos/id/24/200/300',
    },
    likes: 142,
    comments: 38,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: {
      name: 'Ernest Hemingway',
      username: 'ehemingway',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    content: 'Currently reading "Klara and the Sun" by Kazuo Ishiguro. His writing style is so unique - the way he builds this near-future world through the eyes of an AI is fascinating. Anyone else reading this?',
    image: null,
    book: {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      cover: 'https://picsum.photos/id/25/200/300',
    },
    likes: 87,
    comments: 14,
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    author: {
      name: 'Virginia Woolf',
      username: 'vwoolf',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    content: '"And for a moment I felt that if we were sinking, it was exactly where we belonged." - Beautiful line from "A Little Life" by Hanya Yanagihara. This book has completely destroyed me. #currentlyreading',
    image: 'https://picsum.photos/id/26/600/400',
    book: {
      title: 'A Little Life',
      author: 'Hanya Yanagihara',
      cover: 'https://picsum.photos/id/26/200/300',
    },
    likes: 215,
    comments: 47,
    timestamp: '1 day ago',
  },
];

const mockRecommendations = [
  {
    id: 1,
    title: 'Circe',
    author: 'Madeline Miller',
    cover: 'https://picsum.photos/id/82/200/300',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    cover: 'https://picsum.photos/id/83/200/300',
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Normal People',
    author: 'Sally Rooney',
    cover: 'https://picsum.photos/id/84/200/300',
    rating: 4.5,
  },
  {
    id: 4,
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    cover: 'https://picsum.photos/id/85/200/300',
    rating: 4.6,
  },
];

const mockReadingChallenges = [
  {
    id: 1,
    title: '2023 Reading Challenge',
    goal: 50,
    current: 23,
    progress: 46,
  },
  {
    id: 2,
    title: 'Science Fiction Month',
    goal: 4,
    current: 2,
    progress: 50,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showHeartAnimation, setShowHeartAnimation] = useState<number | null>(null);

  useEffect(() => {
    // If auth check is done and user is not logged in, redirect to login
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
  }, [router, isLoggedIn, authLoading]);

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleDoubleTap = (postId: number) => {
    if (!likedPosts.includes(postId)) {
      setLikedPosts([...likedPosts, postId]);
      setShowHeartAnimation(postId);
      setTimeout(() => {
        setShowHeartAnimation(null);
      }, 1000);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const username = user?.username || 'Demo User';

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-6xl fade-in">
      {/* Stories */}
      <div className="mb-6">
        <StoriesBar />
      </div>
      
      {/* Main Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Feed */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-serif font-bold mb-4">For You</h2>
          
          <div className="space-y-6">
            {mockFeed.map((post) => (
              <div key={post.id} className="feed-card fade-in">
                {/* Card Header */}
                <div className="feed-card-header">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)] text-sm">{post.author.name}</div>
                      <div className="text-xs text-[var(--primary-dark)]">@{post.author.username}</div>
                    </div>
                  </div>
                  <button className="ml-auto text-[var(--primary-dark)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Content */}
                <div 
                  className="feed-card-content"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  {post.image ? (
                    <div className="relative aspect-video">
                      <Image 
                        src={post.image} 
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                      {showHeartAnimation === post.id && (
                        <div className="heart-animation">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="white">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[var(--primary-light)] dark:bg-[var(--primary-light)] p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                          <Image 
                            src={post.book.cover} 
                            alt={post.book.title}
                            width={96}
                            height={128}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="font-medium text-[var(--foreground)]">{post.book.title}</div>
                      <div className="text-sm text-[var(--primary-dark)]">by {post.book.author}</div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="feed-card-actions">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="action-btn"
                      onClick={() => handleLike(post.id)}
                    >
                      {likedPosts.includes(post.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent-color)]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                    <button className="action-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className="action-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  <button className="action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                {/* Likes */}
                <div className="px-4 py-1">
                  <span className="font-medium text-sm">{likedPosts.includes(post.id) ? post.likes + 1 : post.likes} likes</span>
                </div>
                
                {/* Description */}
                <div className="feed-card-description">
                  <p className="text-sm">
                    <span className="font-medium mr-1">{post.author.username}</span>
                    {post.content}
                  </p>
                </div>
                
                {/* Comments */}
                <div className="px-4 py-1">
                  <button className="text-[var(--primary-dark)] text-sm">
                    View all {post.comments} comments
                  </button>
                </div>
                
                {/* Timestamp */}
                <div className="px-4 py-2 border-t border-[var(--card-border)]">
                  <span className="text-[var(--primary-dark)] text-xs uppercase">{post.timestamp}</span>
                </div>
                
                {/* Add Comment */}
                <div className="flex items-center px-4 py-2 border-t border-[var(--card-border)]">
                  <button className="action-btn mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="bg-transparent flex-grow text-sm focus:outline-none"
                  />
                  <button className="ml-auto text-[var(--accent-color)] font-medium text-sm">Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* User Welcome */}
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-light)] flex items-center justify-center font-bold text-xl text-[var(--primary-dark)]">
                {username ? username[0].toUpperCase() : 'D'}
              </div>
              <div className="ml-3">
                <div className="font-semibold">Welcome, {username}</div>
                <div className="text-sm text-[var(--primary-dark)]">Enjoy your reading journey!</div>
              </div>
            </div>
            <Link href="/bookshelf" className="btn-primary w-full block text-center">
              View Your Bookshelf
            </Link>
          </div>
          
          {/* Reading Challenges */}
          <div className="card p-4">
            <h2 className="text-lg font-serif font-bold mb-3">Reading Challenges</h2>
            <div className="space-y-4">
              {mockReadingChallenges.map(challenge => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{challenge.title}</span>
                    <span className="font-medium">{challenge.current} of {challenge.goal} books</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--primary-light)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent-color)]" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <Link href="/challenges" className="btn-secondary w-full block text-center text-sm">
                See All Challenges
              </Link>
            </div>
          </div>
          
          {/* Book Recommendations */}
          <div className="card p-4">
            <h2 className="text-lg font-serif font-bold mb-3">Recommended Books</h2>
            <div className="space-y-3">
              {mockRecommendations.map(book => (
                <Link href={`/book/${book.id}`} key={book.id} className="flex items-center gap-3 hover:bg-[var(--primary-light)] p-2 rounded transition-colors">
                  <div className="w-10 h-14 relative overflow-hidden rounded flex-shrink-0">
                    <Image 
                      src={book.cover} 
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm font-semibold">{book.title}</h3>
                    <p className="text-xs text-[var(--primary-dark)]">{book.author}</p>
                    <div className="flex text-[var(--accent-color)] text-xs mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(book.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/discover" className="btn-secondary w-full block text-center text-sm">
                Discover More Books
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavBar />
    </div>
  );
} 