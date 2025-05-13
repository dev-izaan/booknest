import { NextResponse } from 'next/server';

// Add force-static directive to make this compatible with static exports
export const dynamic = 'force-static';

// Mock users (this would come from a database in a real app)
const mockUsers = [
  {
    id: '101',
    name: 'Jane Austen',
    username: 'janeausten',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Author of classic novels exploring relationships and social structure in early 19th century England.',
    favoriteGenres: ['Classic', 'Romance'],
    booksRead: 128,
    followers: 1243,
    following: 86,
    isOnline: true,
  },
  {
    id: '102',
    name: 'Ernest Hemingway',
    username: 'ehemingway',
    email: 'ernest@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Nobel Prize winning author known for works with economic language and understated emotion.',
    favoriteGenres: ['Literary Fiction', 'Adventure'],
    booksRead: 215,
    followers: 2109,
    following: 43,
    isOnline: false,
  },
  {
    id: '103',
    name: 'Virginia Woolf',
    username: 'vwoolf',
    email: 'virginia@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'Modernist author and pioneer of stream of consciousness narrative style.',
    favoriteGenres: ['Modernist', 'Feminist Literature'],
    booksRead: 189,
    followers: 1876,
    following: 112,
    isOnline: true,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const username = searchParams.get('username');
  
  // Get a single user by ID
  if (id) {
    const user = mockUsers.find(user => user.id === id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  }
  
  // Get a single user by username
  if (username) {
    const user = mockUsers.find(user => user.username === username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  }
  
  // Return all users
  return NextResponse.json(mockUsers);
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Basic validation
    if (!userData.name || !userData.username || !userData.email) {
      return NextResponse.json(
        { error: 'Name, username, and email are required' },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    if (mockUsers.some(user => user.username === userData.username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // In a real app, this would save to a database
    const newUser = {
      id: (Number(mockUsers[mockUsers.length - 1].id) + 1).toString(),
      ...userData,
      followers: 0,
      following: 0,
      booksRead: 0,
      isOnline: false,
    };
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would update the database record
    return NextResponse.json(
      { id, ...userData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 