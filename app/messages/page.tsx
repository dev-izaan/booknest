'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';
import { MessageService } from '@/app/api/messages/service';

export default function MessagesPage() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status (would use a proper auth hook in real app)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Fetch conversations from API
    const fetchConversations = async () => {
      try {
        const data = await MessageService.getConversations();
        setConversations(data as any[]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [router]);

  const filteredConversations = conversations.filter(
    (convo) => 
      convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (convoId: number) => {
    setActiveChat(convoId);
    
    // Mark messages as read when clicking on a conversation
    MessageService.markAsRead(convoId).then(() => {
      setConversations(conversations.map(convo => 
        convo.id === convoId 
          ? { ...convo, unreadCount: 0, lastMessage: { ...convo.lastMessage, isRead: true } } 
          : convo
      ));
    });
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
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--card-border)] flex justify-between items-center">
            <h1 className="text-lg font-medium">Messages</h1>
            <button className="text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Search */}
          <div className="px-4 py-2 border-b border-[var(--card-border)]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full py-2 pl-10 pr-4 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Conversation List */}
          <div className="divide-y divide-[var(--card-border)] max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((convo) => (
                <Link 
                  key={convo.id}
                  href={`/messages/${convo.id}`}
                  className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    activeChat === convo.id ? 'bg-blue-50 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => handleChatClick(convo.id)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={convo.user.avatar}
                        alt={convo.user.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {convo.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <h2 className="font-medium text-gray-900 dark:text-gray-100">{convo.user.name}</h2>
                      <span className="text-xs text-gray-500">{convo.lastMessage.timestamp}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate max-w-[180px] ${
                        !convo.lastMessage.isRead && !convo.lastMessage.isFromMe 
                          ? 'font-medium text-gray-900 dark:text-gray-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {convo.lastMessage.isFromMe && 'You: '}{convo.lastMessage.text}
                      </p>
                      
                      {convo.unreadCount > 0 && (
                        <div className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {convo.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <MobileNavBar activePage="messages" />
    </div>
  );
} 