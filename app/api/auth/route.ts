import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Add force-static directive to make this compatible with static exports
export const dynamic = 'force-static';

// Mock users for authentication
const mockUsers = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123', // In a real app, this would be hashed
    username: 'demouser',
    avatar: 'https://randomuser.me/api/portraits/people/1.jpg',
  },
  'jane@example.com': {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Doe',
    password: 'password123', // In a real app, this would be hashed
    username: 'janedoe',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
};

// Handle login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists and password matches
    const user = mockUsers[email as keyof typeof mockUsers];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // In a real app, we would generate a JWT token here
    const session = {
      userId: user.id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    };
    
    // Set a session cookie
    cookies().set({
      name: 'session',
      value: JSON.stringify(session),
      httpOnly: true,
      path: '/',
      expires: session.expires,
    });
    
    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Handle logout
export async function DELETE() {
  // Clear the session cookie
  cookies().set({
    name: 'session',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  return NextResponse.json({ success: true });
}

// Get current user
export async function GET() {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get('session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    if (new Date(session.expires) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }
    
    // Find the user by ID
    const user = Object.values(mockUsers).find(user => user.id === session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 