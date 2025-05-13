'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Story {
  id: number;
  username: string;
  avatar: string;
  hasUnread: boolean;
  bookCover?: string;
  bookTitle?: string;
  bookAuthor?: string;
  content?: string;
}

const mockStories: Story[] = [
  { 
    id: 1, 
    username: 'booklover23', 
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg', 
    hasUnread: true,
    bookCover: 'https://picsum.photos/id/24/200/300',
    bookTitle: 'The Midnight Library',
    bookAuthor: 'Matt Haig',
    content: "I'm halfway through \"The Midnight Library\" and can't put it down! Has anyone else read it?"
  },
  { 
    id: 2, 
    username: 'pageturner', 
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg', 
    hasUnread: true,
    bookCover: 'https://picsum.photos/id/25/200/300',
    bookTitle: 'Klara and the Sun',
    bookAuthor: 'Kazuo Ishiguro',
    content: "Just started \"Klara and the Sun\" - the way Ishiguro writes AI perspectives is fascinating!"
  },
  { 
    id: 3, 
    username: 'noveladdict', 
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg', 
    hasUnread: true,
    bookCover: 'https://picsum.photos/id/26/200/300',
    bookTitle: 'A Little Life',
    bookAuthor: 'Hanya Yanagihara',
    content: "This book is breaking my heart. \"A Little Life\" is emotionally devastating but so beautifully written."
  },
  { 
    id: 4, 
    username: 'bookworm', 
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg', 
    hasUnread: false,
    bookCover: 'https://picsum.photos/id/27/200/300',
    bookTitle: 'The Song of Achilles',
    bookAuthor: 'Madeline Miller',
    content: "Rereading \"The Song of Achilles\" for the third time. I never get tired of this story!"
  },
  { 
    id: 5, 
    username: 'fictionfan', 
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg', 
    hasUnread: true,
    bookCover: 'https://picsum.photos/id/28/200/300',
    bookTitle: 'Project Hail Mary',
    bookAuthor: 'Andy Weir',
    content: "If you loved The Martian, you have to read \"Project Hail Mary\" - just as funny and scientifically mind-blowing!"
  },
  { 
    id: 6, 
    username: 'readingtime', 
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg', 
    hasUnread: false,
    bookCover: 'https://picsum.photos/id/29/200/300',
    bookTitle: 'Circe',
    bookAuthor: 'Madeline Miller',
    content: "Madeline Miller's \"Circe\" deserves all the praise. A powerful retelling from a female perspective!"
  },
  { 
    id: 7, 
    username: 'bookish', 
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg', 
    hasUnread: true,
    bookCover: 'https://picsum.photos/id/30/200/300',
    bookTitle: 'Pachinko',
    bookAuthor: 'Min Jin Lee',
    content: "Reading \"Pachinko\" - a multi-generational epic that's teaching me so much about Korean history."
  },
  { 
    id: 8, 
    username: 'literati', 
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg', 
    hasUnread: false,
    bookCover: 'https://picsum.photos/id/31/200/300',
    bookTitle: 'The House in the Cerulean Sea',
    bookAuthor: 'TJ Klune',
    content: "\"The House in the Cerulean Sea\" is the perfect comfort read - like a warm hug in book form!"
  },
];

export default function StoriesBar() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [viewedStories, setViewedStories] = useState<number[]>([]);

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
    if (!viewedStories.includes(story.id)) {
      setViewedStories([...viewedStories, story.id]);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  return (
    <>
      <div className="w-full overflow-x-auto no-scrollbar pt-4 pb-2">
        <div className="flex space-x-4 px-4">
          <div className="flex flex-col items-center space-y-1 min-w-16">
            <div className="story-circle">
              <div className="story-circle-inner">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center relative cursor-pointer hover:bg-[var(--primary-light)] hover:brightness-95 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="absolute bottom-0 right-0 bg-[var(--accent-color)] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">+</div>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium">Your story</span>
          </div>

          {mockStories.map(story => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-16">
              <div 
                className={story.hasUnread && !viewedStories.includes(story.id) 
                  ? 'story-circle' 
                  : 'relative rounded-full p-[2px] border-2 border-[var(--card-border)] cursor-pointer transition-transform hover:scale-105'}
                onClick={() => handleStoryClick(story)}
              >
                <div className={story.hasUnread && !viewedStories.includes(story.id) ? "story-circle-inner" : "w-16 h-16 rounded-full bg-white p-[2px]"}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image 
                      src={story.avatar} 
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
        </div>
      </div>

      {activeStory && (
        <div className="fixed inset-0 bg-black/90 z-50 animate-fadeIn" onClick={closeStory}>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-white/30">
                <Image 
                  src={activeStory.avatar} 
                  alt={activeStory.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{activeStory.username}</span>
              <span className="ml-2 text-xs text-white/70">5h</span>
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
            <div className="aspect-[9/16] bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary-color)] rounded-lg overflow-hidden flex items-center justify-center shadow-2xl border border-[var(--card-border)]">
              <div className="text-center p-8">
                <h3 className="text-2xl font-serif font-bold mb-2 text-white">Currently Reading</h3>
                <p className="text-gray-100 mb-6 max-w-xs mx-auto">{activeStory.content}</p>
                <div className="max-w-[200px] mx-auto mb-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image 
                    src={activeStory.bookCover || "https://picsum.photos/id/24/200/300"} 
                    alt={activeStory.bookTitle || "Book Cover"} 
                    width={200}
                    height={300}
                    className="rounded-md border border-[var(--card-border)]"
                  />
                </div>
                <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-white">
                  {activeStory.bookTitle} • {activeStory.bookAuthor}
                </div>
                
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
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </>
  );
} 