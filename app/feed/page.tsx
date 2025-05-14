'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';
import StoriesBar from '@/components/StoriesBar';
import { PostsService, StoriesService, type Post } from '@/lib/services/local-storage-service';
import { generatePlaceholderImage } from '@/lib/services/image-service';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);
  const observerTarget = useRef(null);

  useEffect(() => {
    // Check authentication status
    const userString = localStorage.getItem('bookTok_currentUser');
    
    if (!userString) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      
      // Fetch posts
      const allPosts = PostsService.getPosts();
      setPosts(allPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore && posts.length >= 5) {
          // In a real app with pagination, this would load more posts
          // For now, we just simulate a loading state
          setIsLoadingMore(true);
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1000);
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
  }, [observerTarget, isLoadingMore, posts.length]);

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    
    PostsService.likePost(postId, currentUser.id);
    
    // Update local state to reflect the change
    const updatedPosts = PostsService.getPosts();
    setPosts(updatedPosts);
  };

  const navigateToCreatePost = () => {
    router.push('/create-post');
  };

  const navigateToCreateStory = () => {
    router.push('/create-story');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20">
      <div className="max-w-lg mx-auto">
        {/* Stories Bar */}
        <StoriesBar />
        
        {/* Post Creation Button */}
        <div className="px-4 py-3 mb-4">
          <button 
            onClick={navigateToCreatePost}
            className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 text-left flex items-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image 
                src={currentUser?.avatar || generatePlaceholderImage(currentUser?.username || 'User', 40, 40)}
                alt="Your profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[var(--text-secondary)]">What book are you reading now?</span>
          </button>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden shadow-sm"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={post.userAvatar || generatePlaceholderImage(post.username, 40, 40)}
                        alt={post.username}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">{post.username}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-[var(--text-secondary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 py-2">
                  <p className="text-[var(--text-primary)] mb-3">{post.content}</p>
                  
                  {post.imageUrl && (
                    <div className="rounded-md overflow-hidden my-2">
                      <Image 
                        src={post.imageUrl}
                        alt="Post image"
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  
                  {post.bookTitle && (
                    <div className="flex items-center p-3 bg-[var(--background)] rounded-md mt-2">
                      {post.bookCover && (
                        <div className="w-12 h-16 mr-3">
                          <Image 
                            src={post.bookCover}
                            alt={post.bookTitle}
                            width={48}
                            height={64}
                            className="w-full h-full object-cover rounded-sm shadow-sm"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">{post.bookTitle}</h4>
                        {post.bookAuthor && (
                          <p className="text-sm text-[var(--text-secondary)]">by {post.bookAuthor}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-[var(--card-border)] flex justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="flex items-center space-x-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                      onClick={() => handleLike(post.id)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill={post.likedBy.includes(currentUser?.id || '') ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={post.likedBy.includes(currentUser?.id || '') ? "0" : "2"}
                        style={{ color: post.likedBy.includes(currentUser?.id || '') ? "var(--accent-color)" : "" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  
                  <button className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-8 text-center">
              <p className="text-[var(--text-secondary)] mb-4">No posts yet!</p>
              <button 
                onClick={navigateToCreatePost}
                className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Create your first post
              </button>
            </div>
          )}
          
          {/* Loading indicator for infinite scroll */}
          {posts.length > 0 && (
            <div ref={observerTarget} className="flex justify-center py-4">
              {isLoadingMore ? (
                <div className="spinner"></div>
              ) : (
                <p className="text-[var(--text-secondary)] text-sm">No more posts to load</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <MobileNavBar activePage="feed" />
      
      {/* Create Post Floating Button */}
      <button 
        onClick={navigateToCreatePost}
        className="fixed right-6 bottom-20 bg-[var(--accent-color)] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <style jsx>{`
        .spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--card-border);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
} 