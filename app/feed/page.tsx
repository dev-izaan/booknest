'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';
import StoriesBar from '@/components/StoriesBar';

// Mock post data with various types of content
const mockPosts = [
  {
    id: 1,
    type: 'photo',
    author: {
      id: 101,
      name: 'Jane Austen',
      username: 'janeausten',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    content: 'Just got this beautiful edition of "The Midnight Library" - the cover art is stunning! #bookhaul',
    media: 'https://picsum.photos/id/24/600/800',
    book: {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      id: 1001,
    },
    likes: 142,
    comments: 38,
    shares: 12,
    bookmarks: 27,
    timestamp: '2 hours ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 2,
    type: 'review',
    author: {
      id: 102,
      name: 'Ernest Hemingway',
      username: 'ehemingway',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    content: 'Just finished "Klara and the Sun" by Kazuo Ishiguro. His writing style is so unique and the way he builds this near-future world through the eyes of an AI is fascinating. The novel explores what it means to be human through the perspective of a non-human entity. Highly recommend it for science fiction and literary fiction fans alike.',
    rating: 4.5,
    book: {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      cover: 'https://picsum.photos/id/25/200/300',
      id: 1002,
    },
    likes: 87,
    comments: 14,
    shares: 5,
    bookmarks: 31,
    timestamp: '5 hours ago',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 3,
    type: 'quote',
    author: {
      id: 103,
      name: 'Virginia Woolf',
      username: 'vwoolf',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    content: '"And for a moment I felt that if we were sinking, it was exactly where we belonged."',
    book: {
      title: 'A Little Life',
      author: 'Hanya Yanagihara',
      id: 1003,
    },
    background: 'gradient-to-r from-purple-500 to-pink-500',
    likes: 215,
    comments: 47,
    shares: 78,
    bookmarks: 104,
    timestamp: '1 day ago',
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 4,
    type: 'video',
    author: {
      id: 104,
      name: 'Franz Kafka',
      username: 'fkafka',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    content: 'Bookshelf tour! Finally organized my collection by color 🌈 #bookshelf #organization',
    media: 'https://example.com/videos/sample.mp4', // In a real app, this would be a video URL
    thumbnail: 'https://picsum.photos/id/26/600/400',
    duration: '0:42',
    likes: 328,
    comments: 56,
    shares: 23,
    bookmarks: 45,
    timestamp: '2 days ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 5,
    type: 'reel',
    author: {
      id: 105,
      name: 'Emily Brontë',
      username: 'ebronte',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    content: 'POV: You&apos;re reading Wuthering Heights on a stormy night ⛈️ #BookTok #ClassicLiterature',
    media: 'https://example.com/videos/reel.mp4', // In a real app, this would be a video URL
    thumbnail: 'https://picsum.photos/id/27/600/800',
    audio: 'Moonlight Sonata - Beethoven',
    duration: '0:28',
    likes: 1245,
    comments: 132,
    shares: 421,
    bookmarks: 307,
    timestamp: '3 days ago',
    isLiked: true,
    isBookmarked: true,
  },
];

// Continue with more mock posts
const extraMockPosts = Array(15).fill(null).map((_, index) => {
  const baseIndex = index + 6;
  const types = ['photo', 'review', 'quote', 'video', 'reel'];
  const type = types[index % types.length];
  
  return {
    id: baseIndex,
    type,
    author: {
      id: 100 + baseIndex,
      name: `Author ${baseIndex}`,
      username: `author${baseIndex}`,
      avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${baseIndex % 10 + 1}.jpg`,
    },
    content: `This is post number ${baseIndex} of type ${type}. #books #reading`,
    media: type === 'photo' ? `https://picsum.photos/id/${30 + index}/600/800` : null,
    thumbnail: (type === 'video' || type === 'reel') ? `https://picsum.photos/id/${30 + index}/600/800` : null,
    book: {
      title: `Book Title ${baseIndex}`,
      author: `Book Author ${baseIndex}`,
      id: 1000 + baseIndex,
      cover: type === 'review' ? `https://picsum.photos/id/${40 + index}/200/300` : null,
    },
    rating: type === 'review' ? (3 + Math.random() * 2).toFixed(1) : null,
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    bookmarks: Math.floor(Math.random() * 75),
    timestamp: `${baseIndex} days ago`,
    isLiked: Math.random() > 0.5,
    isBookmarked: Math.random() > 0.7,
  };
});

// Combine all mock posts
const allMockPosts = [...mockPosts, ...extraMockPosts];

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(allMockPosts.slice(0, 5));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);

  useEffect(() => {
    // Check authentication status (would use a proper auth hook in real app)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, isLoadingMore]);

  const loadMorePosts = () => {
    if (isLoadingMore || posts.length >= allMockPosts.length) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const nextPosts = allMockPosts.slice(0, (page + 1) * 5);
      setPosts(nextPosts);
      setPage(page + 1);
      setIsLoadingMore(false);
    }, 1000);
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          } 
        : post
    ));
  };

  const handleBookmark = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { 
            ...post, 
            isBookmarked: !post.isBookmarked, 
            bookmarks: post.isBookmarked ? post.bookmarks - 1 : post.bookmarks + 1 
          } 
        : post
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center px-4 py-3">
            <h1 className="text-xl font-bold text-blue-600">BookTok</h1>
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stories bar - Now separated from the header */}
      <div className="bg-white border-b border-gray-200 mb-4">
        <div className="max-w-2xl mx-auto pt-3 pb-2">
          <StoriesBar />
        </div>
      </div>
      
      {/* Content Filters */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
          <button className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex-shrink-0">
            For You
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm flex-shrink-0">
            Following
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm flex-shrink-0">
            Book Reviews
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm flex-shrink-0">
            Photos
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm flex-shrink-0">
            Videos
          </button>
        </div>
      </div>
      
      {/* Feed content */}
      <div className="max-w-2xl mx-auto px-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden">
            {/* Post header */}
            <div className="flex items-center p-4">
              <Image 
                src={post.author.avatar} 
                alt={post.author.name} 
                width={40} 
                height={40} 
                className="rounded-full mr-3 border border-gray-200" 
              />
              <div>
                <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm hover:underline">{post.author.name}</Link>
                <p className="text-gray-500 text-xs">{post.timestamp}</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            {/* Post content */}
            {post.type === 'quote' ? (
              <div className="p-8 text-white bg-gradient-to-r from-purple-500 to-pink-500 text-center">
                <p className="text-xl italic font-serif">{post.content}</p>
                <p className="mt-4 font-medium">— {post.book.author}, {post.book.title}</p>
              </div>
            ) : (
              <div className="px-4 py-2">
                <p className="text-sm mb-2 leading-relaxed">{post.content}</p>
                {post.book && post.book.title && post.type !== 'quote' && (
                  <Link href={`/book/${post.book.id}`} className="inline-flex items-center text-xs text-blue-600 mb-2 hover:text-blue-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {post.book.title} by {post.book.author}
                  </Link>
                )}
              </div>
            )}
            
            {/* Post media */}
            {post.type === 'photo' && post.media && (
              <div className="relative pt-[100%]">
                <Image 
                  src={post.media} 
                  alt="Post image"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full absolute top-0 left-0"
                />
              </div>
            )}
            
            {(post.type === 'video' || post.type === 'reel') && post.thumbnail && (
              <div className="relative pt-[100%]">
                <Image 
                  src={post.thumbnail} 
                  alt="Video thumbnail"
                  fill
                  style={{ objectFit: post.type === 'reel' ? 'cover' : 'contain' }}
                  className="w-full h-full absolute top-0 left-0"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-opacity cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {'duration' in post && post.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {post.duration}
                  </div>
                )}
                {'audio' in post && post.audio && post.type === 'reel' && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    {post.audio}
                  </div>
                )}
              </div>
            )}
            
            {post.type === 'review' && post.book && post.book.cover && (
              <div className="flex p-4 bg-gray-50 border-t border-b border-gray-100">
                <div className="relative h-24 w-16 mr-4 shadow-md">
                  <Image 
                    src={post.book.cover} 
                    alt={post.book.title || 'Book cover'}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
                <div>
                  <Link href={`/book/${post.book.id}`} className="font-medium text-sm hover:text-blue-700 transition-colors">{post.book.title}</Link>
                  <p className="text-gray-600 text-xs">{post.book.author}</p>
                  <div className="flex items-center mt-1">
                    {Array.from({length: 5}).map((_, i) => {
                      // Ensure we have a valid rating number
                      const rating = typeof post.rating === 'number' ? post.rating : 0;
                      return (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4" 
                          viewBox="0 0 20 20" 
                          fill={i < Math.floor(rating) ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          strokeWidth={1.5} 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          color={i < Math.floor(rating) ? '#FBBF24' : '#D1D5DB'}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                    <span className="text-xs ml-1 text-gray-600">{post.rating}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Post actions */}
            <div className="flex items-center px-4 py-3 border-t border-gray-100">
              <button 
                className={`flex items-center ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} mr-6 transition-colors`}
                onClick={() => handleLike(post.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs ml-1 font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700 mr-6 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs ml-1 font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700 mr-6 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-xs ml-1 font-medium">{post.shares}</span>
              </button>
              <button 
                className={`flex items-center ml-auto ${post.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} transition-colors`}
                onClick={() => handleBookmark(post.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={post.isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-xs ml-1 font-medium">{post.bookmarks}</span>
              </button>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        <div ref={observerTarget} className="py-4 flex justify-center">
          {isLoadingMore && (
            <div className="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {!isLoadingMore && posts.length >= allMockPosts.length && (
            <p className="text-gray-500 text-sm">You&apos;ve reached the end</p>
          )}
        </div>
      </div>
      
      {/* Quick Post button */}
      <div className="fixed bottom-20 right-4 z-10">
        <button 
          onClick={() => router.push('/create-post')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar activePage="feed" />
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 