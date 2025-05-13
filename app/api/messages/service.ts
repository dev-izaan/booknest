// Define types
interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface Message {
  id: number;
  senderId: number | string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  user: User;
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    isFromMe: boolean;
  };
  unreadCount: number;
}

interface UserMap {
  [key: number]: User;
}

interface MessageMap {
  [key: number]: Message[];
}

// Mock data for users
export const mockUsers: UserMap = {
  101: {
    id: 101,
    name: 'Jane Austen',
    username: 'janeausten',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    isOnline: true,
  },
  102: {
    id: 102,
    name: 'Ernest Hemingway',
    username: 'ehemingway',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    isOnline: false,
  },
  103: {
    id: 103,
    name: 'Virginia Woolf',
    username: 'vwoolf',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    isOnline: true,
  },
  104: {
    id: 104,
    name: 'F. Scott Fitzgerald',
    username: 'fscottfitz',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    isOnline: false,
  },
  105: {
    id: 105,
    name: 'Agatha Christie',
    username: 'agchristie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    isOnline: true,
  },
};

// Mock data for messages
export const mockMessages: MessageMap = {
  1: [
    {
      id: 1,
      senderId: 101,
      text: 'Hello there, I noticed you love classic literature!',
      timestamp: 'Yesterday 10:15 AM',
      isRead: true,
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hi Jane! Yes, I&apos;m a big fan of the classics. Your novels are some of my favorites.',
      timestamp: 'Yesterday 10:20 AM',
      isRead: true,
    },
    {
      id: 3,
      senderId: 101,
      text: 'That&apos;s so kind of you to say! I&apos;m curious - which of my works have you read?',
      timestamp: 'Yesterday 10:25 AM',
      isRead: true,
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Pride and Prejudice is my absolute favorite, but I also love Sense and Sensibility and Emma.',
      timestamp: 'Yesterday 10:30 AM',
      isRead: true,
    },
    {
      id: 5,
      senderId: 101,
      text: 'Wonderful choices! Mr. Darcy has always been a favorite character of mine as well.',
      timestamp: 'Yesterday 10:35 AM',
      isRead: true,
    },
    {
      id: 6,
      senderId: 101,
      text: 'Have you read "Pride and Prejudice" yet?',
      timestamp: '10:23 AM',
      isRead: true,
    },
  ],
  2: [
    {
      id: 1,
      senderId: 102,
      text: 'Hello, I saw you were reading one of my books.',
      timestamp: 'Monday 3:15 PM',
      isRead: true,
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hi Ernest! Yes, I just finished "The Old Man and the Sea." It was incredible.',
      timestamp: 'Monday 3:20 PM',
      isRead: true,
    },
    {
      id: 3,
      senderId: 102,
      text: 'I&apos;m glad you enjoyed it. That story is very special to me.',
      timestamp: 'Monday 3:30 PM',
      isRead: true,
    },
    {
      id: 4,
      senderId: 102,
      text: 'I loved your review on "The Old Man and the Sea"',
      timestamp: 'Yesterday',
      isRead: false,
    },
    {
      id: 5,
      senderId: 102,
      text: 'Would you like to read more of my work?',
      timestamp: 'Yesterday',
      isRead: false,
    },
  ],
  3: [
    {
      id: 1,
      senderId: 103,
      text: 'Hello! I saw your post about "To the Lighthouse".',
      timestamp: 'Monday 11:30 AM',
      isRead: true,
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hi Virginia! Yes, I was just talking about how much I loved the stream of consciousness style.',
      timestamp: 'Monday 11:45 AM',
      isRead: true,
    },
    {
      id: 3,
      senderId: 103,
      text: 'It&apos;s a style I&apos;ve always been drawn to. It allows such an intimate portrayal of character.',
      timestamp: 'Monday 12:00 PM',
      isRead: true,
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Absolutely! It really puts the reader in the character&apos;s mind. Are you working on any new books?',
      timestamp: 'Monday 12:15 PM',
      isRead: true,
    },
    {
      id: 5,
      senderId: 103,
      text: 'I have a few ideas brewing. I&apos;ll be sure to share them with you soon.',
      timestamp: 'Yesterday 9:30 AM',
      isRead: true,
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Thanks for the book recommendation!',
      timestamp: 'Yesterday',
      isRead: true,
    },
  ],
};

// Mock data for conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    user: mockUsers[101],
    lastMessage: {
      text: 'Have you read "Pride and Prejudice" yet?',
      timestamp: '10:23 AM',
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
  },
  {
    id: 2,
    user: mockUsers[102],
    lastMessage: {
      text: 'Would you like to read more of my work?',
      timestamp: 'Yesterday',
      isRead: false,
      isFromMe: false,
    },
    unreadCount: 2,
  },
  {
    id: 3,
    user: mockUsers[103],
    lastMessage: {
      text: 'Thanks for the book recommendation!',
      timestamp: 'Yesterday',
      isRead: true,
      isFromMe: true,
    },
    unreadCount: 0,
  },
  {
    id: 4,
    user: mockUsers[104],
    lastMessage: {
      text: 'What did you think about the ending of "The Great Gatsby"?',
      timestamp: 'Monday',
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
  },
  {
    id: 5,
    user: mockUsers[105],
    lastMessage: {
      text: 'I just finished a new mystery novel that reminded me of your style!',
      timestamp: 'Sunday',
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
  },
];

// Simulate API methods
export const MessageService = {
  getConversations: () => {
    return new Promise<Conversation[]>(resolve => {
      setTimeout(() => {
        resolve(mockConversations);
      }, 500);
    });
  },
  
  getConversation: (id: number) => {
    return new Promise<{messages: Message[], user: User}>((resolve, reject) => {
      setTimeout(() => {
        if (mockMessages[id]) {
          const firstMessage = mockMessages[id][0];
          const senderId = typeof firstMessage.senderId === 'string' 
            ? mockMessages[id][1].senderId as number 
            : firstMessage.senderId as number;
          
          resolve({
            messages: mockMessages[id],
            user: mockUsers[senderId]
          });
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 500);
    });
  },
  
  sendMessage: (conversationId: number, text: string) => {
    return new Promise<Message>((resolve, reject) => {
      setTimeout(() => {
        if (mockMessages[conversationId]) {
          const newMessage: Message = {
            id: mockMessages[conversationId].length + 1,
            senderId: 'me',
            text,
            timestamp: 'Just now',
            isRead: true,
          };
          
          mockMessages[conversationId].push(newMessage);
          
          // Update conversation last message
          const convo = mockConversations.find(c => c.id === conversationId);
          if (convo) {
            convo.lastMessage = {
              text,
              timestamp: 'Just now',
              isRead: true,
              isFromMe: true,
            };
          }
          
          resolve(newMessage);
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 300);
    });
  },
  
  markAsRead: (conversationId: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (mockMessages[conversationId]) {
          mockMessages[conversationId].forEach(msg => {
            if (msg.senderId !== 'me') {
              msg.isRead = true;
            }
          });
          
          const convo = mockConversations.find(c => c.id === conversationId);
          if (convo) {
            convo.unreadCount = 0;
            convo.lastMessage.isRead = true;
          }
          
          resolve();
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 300);
    });
  },
  
  getUser: (userId: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers[userId]) {
          resolve(mockUsers[userId]);
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  }
}; 