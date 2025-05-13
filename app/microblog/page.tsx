'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';

// Mock microblog posts data
const mockMicroblogs = [
  {
    id: 1,
    author: {
      id: 101,
      name: 'Jane Austen',
      username: 'janeausten',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      verified: true,
    },
    content: 'Just started "Tomorrow, and Tomorrow, and Tomorrow" by Gabrielle Zevin and I\'m already hooked. The character development is *chef\'s kiss* #CurrentlyReading',
    timestamp: '10 minutes ago',
    likes: 42,
    replies: 8,
    reposts: 12,
    isLiked: false,
    isReposted: false,
    hasMedia: false,
  },
  {
    id: 2,
    author: {
      id: 102,
      name: 'Ernest Hemingway',
      username: 'ehemingway',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      verified: true,
    },
    content: 'Hot take: Sometimes the book IS better than the movie.',
    timestamp: '45 minutes ago',
    likes: 128,
    replies: 36,
    reposts: 57,
    isLiked: true,
    isReposted: false,
    hasMedia: false,
    isThread: false,
  },
  {
    id: 3,
    author: {
      id: 103,
      name: 'Virginia Woolf',
      username: 'vwoolf',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      verified: true,
    },
    content: 'Anyone else stay up way too late reading "just one more chapter" that turns into finishing the entire book? 📚 #BookwormProblems',
    timestamp: '2 hours ago',
    likes: 215,
    replies: 47,
    reposts: 23,
    isLiked: false,
    isReposted: true,
    hasMedia: false,
  },
  {
    id: 4,
    parentId: 3,
    author: {
      id: 104,
      name: 'Franz Kafka',
      username: 'fkafka',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      verified: false,
    },
    content: 'Every. Single. Time. And then I have to function the next day at work somehow 😴',
    timestamp: '1 hour ago',
    likes: 88,
    replies: 5,
    reposts: 2,
    isLiked: false,
    isReposted: false,
    hasMedia: false,
    isReplyTo: {
      username: 'vwoolf',
    }
  },
  {
    id: 5,
    author: {
      id: 105,
      name: 'Emily Brontë',
      username: 'ebronte',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      verified: false,
    },
    content: 'Local bookshop haul! 📚✨\n\n- "Sea of Tranquility" by Emily St. John Mandel\n- "How High We Go in the Dark" by Sequoia Nagamatsu\n- "The Candy House" by Jennifer Egan',
    timestamp: '3 hours ago',
    likes: 73,
    replies: 12,
    reposts: 8,
    isLiked: true,
    isReposted: false,
    hasMedia: true,
    mediaUrl: 'https://picsum.photos/id/24/400/300',
  },
  {
    id: 6,
    author: {
      id: 106,
      name: 'George Orwell',
      username: 'gorwell',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      verified: true,
    },
    content: 'Thread: My top 5 dystopian novels of all time 🧵\n\n1. "1984" by George Orwell (yes, I\'m biased)',
    timestamp: '5 hours ago',
    likes: 412,
    replies: 28,
    reposts: 145,
    isLiked: false,
    isReposted: false,
    hasMedia: false,
    isThread: true,
  },
  {
    id: 7,
    threadParentId: 6,
    author: {
      id: 106,
      name: 'George Orwell',
      username: 'gorwell',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      verified: true,
    },
    content: '2. "Brave New World" by Aldous Huxley - brilliant exploration of a society controlled by pleasure rather than pain',
    timestamp: '5 hours ago',
    likes: 356,
    replies: 14,
    reposts: 98,
    isLiked: false,
    isReposted: false,
    hasMedia: false,
    isThread: true,
  },
  {
    id: 8,
    threadParentId: 6,
    author: {
      id: 106,
      name: 'George Orwell',
      username: 'gorwell',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      verified: true,
    },
    content: '3. "Fahrenheit 451" by Ray Bradbury - a world where books are burned and critical thinking is discouraged',
    timestamp: '5 hours ago',
    likes: 298,
    replies: 10,
    reposts: 85,
    isLiked: false,
    isReposted: false,
    hasMedia: false,
    isThread: true,
  },
];

// Generate more mock data
const extraMockMicroblogs = Array(12).fill(null).map((_, index) => {
  const baseIndex = index + 9;
  
  return {
    id: baseIndex,
    author: {
      id: 100 + baseIndex,
      name: `Author ${baseIndex}`,
      username: `author${baseIndex}`,
      avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${baseIndex % 10 + 1}.jpg`,
      verified: Math.random() > 0.7,
    },
    content: `This is microblog post number ${baseIndex}. #BookTok #Reading ${Math.random() > 0.5 ? '#BookishThoughts' : ''} ${Math.random() > 0.7 ? '#CurrentlyReading' : ''}`,
    timestamp: `${baseIndex} hours ago`,
    likes: Math.floor(Math.random() * 200),
    replies: Math.floor(Math.random() * 50),
    reposts: Math.floor(Math.random() * 30),
    isLiked: Math.random() > 0.5,
    isReposted: Math.random() > 0.7,
    hasMedia: Math.random() > 0.7,
    mediaUrl: Math.random() > 0.7 ? `https://picsum.photos/id/${30 + index}/400/300` : null,
  };
});

// Combine all mock microblogs
const allMockMicroblogs = [...mockMicroblogs, ...extraMockMicroblogs];

// Extract hashtags from text
const extractHashtags = (text) => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return text.match(hashtagRegex) || [];
};

// Format text with hashtag links
const formatTextWithHashtags = (text) => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return text.split(hashtagRegex).reduce((prev, current, i, arr) => {
    const hashtag = text.match(hashtagRegex)?.[i - 1];
    if (i === 0) {
      return current;
    }
    return prev + (hashtag ? <Link href={`/hashtag/${hashtag.substring(1)}`} className="text-blue-500 hover:underline">{hashtag}</Link> : '') + current;
  }, '');
};

export default function MicroblogPage() {
  const router = useRouter();
  const [microblogs, setMicroblogs] = useState(allMockMicroblogs.slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [postContent, setPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'following'
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
    if (isLoadingMore || microblogs.length >= allMockMicroblogs.length) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const nextPosts = allMockMicroblogs.slice(0, (page + 1) * 10);
      setMicroblogs(nextPosts);
      setPage(page + 1);
      setIsLoadingMore(false);
    }, 1000);
  };

  const handleLike = (id) => {
    setMicroblogs(microblogs.map(post => 
      post.id === id 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          } 
        : post
    ));
  };

  const handleRepost = (id) => {
    setMicroblogs(microblogs.map(post => 
      post.id === id 
        ? { 
            ...post, 
            isReposted: !post.isReposted, 
            reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1 
          } 
        : post
    ));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    if (!postContent.trim()) return;
    
    // Create new post
    const newPost = {
      id: Math.max(...microblogs.map(post => post.id)) + 1,
      author: {
        id: 999,
        name: 'Current User',
        username: 'currentuser',
        avatar: 'https://randomuser.me/api/portraits/women/99.jpg',
        verified: false,
      },
      content: postContent,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      reposts: 0,
      isLiked: false,
      isReposted: false,
      hasMedia: false,
    };
    
    // Add post to the beginning of the list
    setMicroblogs([newPost, ...microblogs]);
    
    // Clear the input
    setPostContent('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center px-4 py-2">
            <h1 className="text-xl font-bold">BookChat</h1>
            <div className="flex space-x-4">
              <button className="text-gray-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('all')}
            >
              For You
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          </div>
        </div>
      </div>
      
      {/* Post form */}
      <div className="max-w-2xl mx-auto bg-white shadow-sm border-b border-gray-200">
        <form onSubmit={handleSubmitPost} className="p-4">
          <div className="flex">
            <Image 
              src="https://randomuser.me/api/portraits/women/99.jpg" 
              alt="User Avatar" 
              width={40} 
              height={40} 
              className="rounded-full mr-3" 
            />
            <div className="flex-1">
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="What are you reading?"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={280}
              ></textarea>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  <button type="button" className="text-blue-500 p-2 rounded-full hover:bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button type="button" className="text-blue-500 p-2 rounded-full hover:bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="text-xs text-gray-500 mr-2">
                    {postContent.length}/280
                  </div>
                  <button 
                    type="submit" 
                    className={`px-4 py-1.5 rounded-full text-white font-medium ${postContent.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`}
                    disabled={!postContent.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Microblog feed */}
      <div className="max-w-2xl mx-auto pt-1">
        {microblogs.map((post) => (
          <div key={post.id} className={`bg-white border-b border-gray-200 p-4 ${post.threadParentId ? 'pl-12 border-l-4 border-l-gray-200' : ''}`}>
            {/* Post header */}
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  width={40} 
                  height={40} 
                  className="rounded-full" 
                />
                {post.threadParentId && <div className="w-0.5 h-full bg-gray-200 mx-auto mt-1"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm hover:underline">{post.author.name}</Link>
                  {post.author.verified && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-gray-500 text-xs ml-1">@{post.author.username}</span>
                  <span className="mx-1 text-gray-500 text-xs">·</span>
                  <span className="text-gray-500 text-xs">{post.timestamp}</span>
                  <button className="ml-auto text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                
                {/* Reply to */}
                {post.isReplyTo && (
                  <div className="text-gray-500 text-xs mb-1">
                    Replying to <Link href={`/profile/${post.isReplyTo.username}`} className="text-blue-500">@{post.isReplyTo.username}</Link>
                  </div>
                )}
                
                {/* Post content */}
                <div className="mt-1">
                  <p className="text-sm whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
                
                {/* Post media */}
                {post.hasMedia && post.mediaUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                    <Image 
                      src={post.mediaUrl} 
                      alt="Post image"
                      width={500}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                {/* Post actions */}
                <div className="flex items-center mt-3 -ml-2">
                  <button className="flex items-center text-gray-500 p-2 rounded-full hover:bg-blue-50 hover:text-blue-500 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs ml-1 group-hover:text-blue-500">{post.replies}</span>
                  </button>
                  <button 
                    className={`flex items-center p-2 rounded-full hover:bg-green-50 group ${post.isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'}`}
                    onClick={() => handleRepost(post.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className={`text-xs ml-1 ${post.isReposted ? 'text-green-500' : 'group-hover:text-green-500'}`}>{post.reposts}</span>
                  </button>
                  <button 
                    className={`flex items-center p-2 rounded-full hover:bg-red-50 group ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className={`text-xs ml-1 ${post.isLiked ? 'text-red-500' : 'group-hover:text-red-500'}`}>{post.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 p-2 rounded-full hover:bg-blue-50 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        <div ref={observerTarget} className="py-4 flex justify-center">
          {isLoadingMore && (
            <div className="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {!isLoadingMore && microblogs.length >= allMockMicroblogs.length && (
            <p className="text-gray-500 text-sm">No more posts to load</p>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar activePage="microblog" />
    </div>
  );
} 