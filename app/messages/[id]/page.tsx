'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';
import { MessageService } from '@/app/api/messages/service';

interface Message {
  id: number;
  senderId: number | string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const convoId = parseInt(params.id);
  
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status (would use a proper auth hook in real app)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Load conversation data
    const fetchConversation = async () => {
      try {
        const data = await MessageService.getConversation(convoId) as { messages: Message[], user: User };
        setMessages(data.messages);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        router.push('/messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
    
    // Mark messages as read
    MessageService.markAsRead(convoId);
  }, [convoId, router]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    try {
      const sentMessage = await MessageService.sendMessage(convoId, newMessage) as Message;
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20">
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden flex flex-col h-[calc(100vh-120px)]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--card-border)] flex items-center sticky top-0 bg-[var(--card-bg)] z-10">
            <Link href="/messages" className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="flex items-center flex-grow">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                )}
              </div>
              
              <div className="ml-3">
                <h2 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{user.name}</h2>
                <span className="text-xs text-gray-500">@{user.username}</span>
              </div>
            </div>
            
            <button className="ml-auto text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-grow overflow-y-auto px-4 py-3 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== 'me' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${msg.senderId === 'me' 
                    ? 'bg-blue-500 text-white rounded-tl-lg rounded-tr-sm rounded-bl-lg rounded-br-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-sm'
                  } px-4 py-2 text-sm`}>
                    <p>{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp}
                      {msg.senderId === 'me' && (
                        <span className="ml-1">
                          {msg.isRead ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="flex items-center">
              <button type="button" className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <div className="flex-grow mx-2">
                <input
                  type="text"
                  placeholder="Message..."
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              
              {newMessage.trim() !== '' ? (
                <button 
                  type="submit" 
                  className="p-2 text-white bg-primary-600 rounded-full hover:bg-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              ) : (
                <>
                  <button type="button" className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button type="button" className="p-2 ml-1 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <MobileNavBar />
    </div>
  );
} 