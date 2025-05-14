'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoriesService, type Story } from '@/lib/services/local-storage-service';
import { generatePlaceholderImage } from '@/lib/services/image-service';

export default function StoriesBar() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);

  useEffect(() => {
    // Load current user
    const userString = localStorage.getItem('bookTok_currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load stories
    const allStories = StoriesService.getStories();
    setStories(allStories);

    // Load viewed stories from localStorage
    const viewedStoriesString = localStorage.getItem('bookTok_viewedStories');
    if (viewedStoriesString) {
      try {
        setViewedStories(JSON.parse(viewedStoriesString));
      } catch (error) {
        console.error('Error parsing viewed stories:', error);
      }
    }
  }, []);

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
    
    if (currentUser && !story.viewedBy.includes(currentUser.id)) {
      StoriesService.markStoryAsViewed(story.id, currentUser.id);
      
      // Update local state
      setViewedStories([...viewedStories, story.id]);
      localStorage.setItem('bookTok_viewedStories', JSON.stringify([...viewedStories, story.id]));
      
      // Refresh stories list
      const updatedStories = StoriesService.getStories();
      setStories(updatedStories);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const navigateToCreateStory = () => {
    router.push('/create-story');
  };

  return (
    <>
      <div className="w-full overflow-x-auto no-scrollbar pt-4 pb-2">
        <div className="flex space-x-4 px-4">
          <div className="flex flex-col items-center space-y-1">
            <div className="story-circle" style={{ width: '68px', height: '68px' }}>
              <div className="story-circle-inner">
                <div 
                  className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center relative cursor-pointer hover:bg-[var(--primary-light)] hover:brightness-95 transition-all"
                  onClick={navigateToCreateStory}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="absolute bottom-0 right-0 bg-[var(--accent-color)] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">+</div>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium">Your story</span>
          </div>

          {stories.map(story => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div 
                className={!story.viewedBy.includes(currentUser?.id || '') 
                  ? 'story-circle' 
                  : 'viewed-story-circle'}
                style={{ width: '68px', height: '68px' }}
                onClick={() => handleStoryClick(story)}
              >
                <div className={!story.viewedBy.includes(currentUser?.id || '') ? "story-circle-inner" : "viewed-story-circle-inner"}>
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src={story.userAvatar || generatePlaceholderImage(story.username, 64, 64)}
                      alt={story.username}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center">{story.username}</span>
            </div>
          ))}

          {stories.length === 0 && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <div className="story-circle opacity-40" style={{ width: '68px', height: '68px' }}>
                <div className="story-circle-inner">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center opacity-40">User</span>
            </div>
          ))}
        </div>
      </div>

      {activeStory && (
        <div className="fixed inset-0 bg-black/90 z-50 animate-fadeIn" onClick={closeStory}>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-white/30">
                <Image 
                  src={activeStory.userAvatar || generatePlaceholderImage(activeStory.username, 32, 32)}
                  alt={activeStory.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{activeStory.username}</span>
              <span className="ml-2 text-xs text-white/70">
                {new Date(activeStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button onClick={(e) => {
              e.stopPropagation();
              closeStory();
            }} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="h-1 bg-gray-700 absolute top-14 left-4 right-4 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-progress" style={{ width: '100%', transformOrigin: 'left' }}></div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full px-4">
            {activeStory.type === 'text' && (
              <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-2xl border border-[var(--card-border)]" 
                style={{ 
                  backgroundColor: activeStory.backgroundColor || 'var(--primary-color)',
                  color: activeStory.textColor || 'white'
                }}>
                <div className="h-full flex items-center justify-center p-8">
                  <p className="text-xl md:text-2xl font-medium text-center">
                    {activeStory.content}
                  </p>
                </div>
              </div>
            )}

            {activeStory.type === 'image' && activeStory.imageUrl && (
              <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-2xl border border-[var(--card-border)]">
                <div className="relative w-full h-full">
                  <Image 
                    src={activeStory.imageUrl}
                    alt="Story"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full"
                  />
                  {activeStory.content && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white">{activeStory.content}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeStory.type === 'book' && (
              <div className="aspect-[9/16] bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary-color)] rounded-lg overflow-hidden flex items-center justify-center shadow-2xl border border-[var(--card-border)]">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Currently Reading</h3>
                  <p className="text-gray-100 mb-6 max-w-xs mx-auto">{activeStory.content}</p>
                  {activeStory.bookCover && (
                    <div className="max-w-[200px] mx-auto mb-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                      <Image 
                        src={activeStory.bookCover}
                        alt={activeStory.bookTitle || "Book Cover"} 
                        width={200}
                        height={300}
                        className="rounded-md border border-[var(--card-border)]"
                      />
                    </div>
                  )}
                  {(activeStory.bookTitle || activeStory.bookAuthor) && (
                    <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-white">
                      {activeStory.bookTitle} {activeStory.bookAuthor && `• ${activeStory.bookAuthor}`}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="absolute bottom-8 w-full left-0 flex justify-center space-x-4 px-8">
              <input 
                type="text" 
                placeholder="Reply..." 
                className="flex-1 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 outline-none border border-white/20 focus:border-white/50 transition-colors"
              />
              <button className="bg-[var(--accent-color)] hover:brightness-110 transition-colors text-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .story-circle {
          position: relative;
          cursor: pointer;
          border-radius: 50%;
          padding: 2px;
          background: var(--story-gradient, linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888));
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          width: 68px;
          height: 68px;
        }
        .story-circle-inner {
          background: var(--card-bg);
          border-radius: 50%;
          padding: 1px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .viewed-story-circle {
          position: relative;
          cursor: pointer;
          border-radius: 50%;
          padding: 2px;
          border: 2px solid var(--card-border);
          transition: transform 0.2s;
          width: 68px;
          height: 68px;
        }
        .viewed-story-circle-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--card-bg);
          padding: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .viewed-story-circle:hover {
          transform: scale(1.05);
        }
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
} 