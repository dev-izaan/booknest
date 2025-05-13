/**
 * API client for BookTok
 * This file contains functions to interact with the API endpoints
 */

// Base URL for API calls
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies with requests
  };
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });
  
  // Handle error responses
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'An error occurred while fetching data');
  }
  
  return response.json();
}

// Books API
export const BooksAPI = {
  getAll: async () => {
    return fetchAPI('/books');
  },
  
  getById: async (id: string) => {
    return fetchAPI(`/books?id=${id}`);
  },
  
  getByGenre: async (genre: string) => {
    return fetchAPI(`/books?genre=${encodeURIComponent(genre)}`);
  },
  
  create: async (bookData: any) => {
    return fetchAPI('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },
};

// Users API
export const UsersAPI = {
  getAll: async () => {
    return fetchAPI('/users');
  },
  
  getById: async (id: string) => {
    return fetchAPI(`/users?id=${id}`);
  },
  
  getByUsername: async (username: string) => {
    return fetchAPI(`/users?username=${encodeURIComponent(username)}`);
  },
  
  create: async (userData: any) => {
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  update: async (id: string, userData: any) => {
    return fetchAPI(`/users?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },
};

// Messages API
export const MessagesAPI = {
  getConversations: async () => {
    return fetchAPI('/messages');
  },
  
  getConversation: async (conversationId: number) => {
    return fetchAPI(`/messages?conversationId=${conversationId}`);
  },
  
  sendMessage: async (conversationId: number, text: string) => {
    return fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify({
        conversationId,
        message: { text },
      }),
    });
  },
  
  markAsRead: async (conversationId: number) => {
    return fetchAPI('/messages', {
      method: 'PATCH',
      body: JSON.stringify({ conversationId }),
    });
  },
};

// Authentication API
export const AuthAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: any) => {
    // This would be a real registration endpoint in a production app
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: async () => {
    return fetchAPI('/auth', {
      method: 'DELETE',
    });
  },
  
  getCurrentUser: async () => {
    try {
      return fetchAPI('/auth');
    } catch (error) {
      // If not authenticated, return null instead of throwing
      return null;
    }
  },
}; 