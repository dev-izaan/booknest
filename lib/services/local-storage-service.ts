'use client';

// Types
export type Post = {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedBy: string[];
};

export type Story = {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'text' | 'image' | 'book';
  content?: string;
  imageUrl?: string;
  bookCover?: string;
  bookTitle?: string;
  bookAuthor?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  expiresAt: string;
  viewedBy: string[];
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  bookId?: string;
  read: boolean;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  following: string[];
  followers: string[];
  booksRead: number;
  reviewsPosted: number;
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Load data from localStorage
const loadData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Posts Service
export const PostsService = {
  getPosts: (): Post[] => {
    return loadData<Post[]>('bookTok_posts', []);
  },
  
  getPostById: (id: string): Post | undefined => {
    const posts = loadData<Post[]>('bookTok_posts', []);
    return posts.find(post => post.id === id);
  },
  
  createPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'likedBy'>): Post => {
    const posts = loadData<Post[]>('bookTok_posts', []);
    
    const newPost: Post = {
      ...post,
      id: generateId(),
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      likedBy: []
    };
    
    posts.unshift(newPost); // Add to beginning of array
    saveData('bookTok_posts', posts);
    
    return newPost;
  },
  
  likePost: (postId: string, userId: string): void => {
    const posts = loadData<Post[]>('bookTok_posts', []);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
      const post = posts[postIndex];
      
      if (post.likedBy.includes(userId)) {
        // Unlike
        post.likedBy = post.likedBy.filter(id => id !== userId);
        post.likes--;
      } else {
        // Like
        post.likedBy.push(userId);
        post.likes++;
      }
      
      posts[postIndex] = post;
      saveData('bookTok_posts', posts);
    }
  },
  
  deletePost: (postId: string): void => {
    let posts = loadData<Post[]>('bookTok_posts', []);
    posts = posts.filter(post => post.id !== postId);
    saveData('bookTok_posts', posts);
  }
};

// Stories Service
export const StoriesService = {
  getStories: (): Story[] => {
    const stories = loadData<Story[]>('bookTok_stories', []);
    
    // Filter out expired stories (older than 24 hours)
    const validStories = stories.filter(story => {
      const expiryTime = new Date(story.expiresAt).getTime();
      return expiryTime > Date.now();
    });
    
    if (validStories.length !== stories.length) {
      saveData('bookTok_stories', validStories);
    }
    
    return validStories;
  },
  
  getStoriesByUser: (userId: string): Story[] => {
    const stories = StoriesService.getStories();
    return stories.filter(story => story.userId === userId);
  },
  
  createStory: (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt' | 'viewedBy'>): Story => {
    const stories = loadData<Story[]>('bookTok_stories', []);
    
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setHours(expiryDate.getHours() + 24); // Expire after 24 hours
    
    const newStory: Story = {
      ...story,
      id: generateId(),
      createdAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      viewedBy: []
    };
    
    stories.unshift(newStory);
    saveData('bookTok_stories', stories);
    
    return newStory;
  },
  
  markStoryAsViewed: (storyId: string, userId: string): void => {
    const stories = loadData<Story[]>('bookTok_stories', []);
    const storyIndex = stories.findIndex(story => story.id === storyId);
    
    if (storyIndex !== -1) {
      const story = stories[storyIndex];
      
      if (!story.viewedBy.includes(userId)) {
        story.viewedBy.push(userId);
        stories[storyIndex] = story;
        saveData('bookTok_stories', stories);
      }
    }
  },
  
  deleteStory: (storyId: string): void => {
    let stories = loadData<Story[]>('bookTok_stories', []);
    stories = stories.filter(story => story.id !== storyId);
    saveData('bookTok_stories', stories);
  }
};

// Messages Service
export const MessagesService = {
  getConversations: (userId: string): Conversation[] => {
    return loadData<Conversation[]>('bookTok_conversations', [])
      .filter(conv => conv.participants.includes(userId))
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  },
  
  getOrCreateConversation: (userIds: string[]): Conversation => {
    const conversations = loadData<Conversation[]>('bookTok_conversations', []);
    
    // Try to find existing conversation with the same participants
    let conversation = conversations.find(conv => 
      conv.participants.length === userIds.length && 
      userIds.every(id => conv.participants.includes(id))
    );
    
    if (!conversation) {
      conversation = {
        id: generateId(),
        participants: userIds,
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      };
      
      conversations.push(conversation);
      saveData('bookTok_conversations', conversations);
    }
    
    return conversation;
  },
  
  getMessages: (conversationId: string): Message[] => {
    return loadData<Message[]>('bookTok_messages', [])
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>): Message => {
    const messages = loadData<Message[]>('bookTok_messages', []);
    const conversations = loadData<Conversation[]>('bookTok_conversations', []);
    
    const newMessage: Message = {
      ...message,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    // Update conversation with last message
    const conversationIndex = conversations.findIndex(conv => conv.id === message.conversationId);
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = newMessage.content;
      conversations[conversationIndex].lastMessageTime = newMessage.createdAt;
      saveData('bookTok_conversations', conversations);
    }
    
    messages.push(newMessage);
    saveData('bookTok_messages', messages);
    
    return newMessage;
  },
  
  markAsRead: (conversationId: string, userId: string): void => {
    const messages = loadData<Message[]>('bookTok_messages', []);
    let updated = false;
    
    messages.forEach((message, index) => {
      if (message.conversationId === conversationId && 
          message.receiverId === userId && 
          !message.read) {
        messages[index].read = true;
        updated = true;
      }
    });
    
    if (updated) {
      saveData('bookTok_messages', messages);
    }
  }
}; 