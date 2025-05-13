import { NextResponse } from 'next/server';

// Import the mock data
import { mockMessages, mockConversations } from './service';

// Add force-static directive to make this compatible with static exports
export const dynamic = 'force-static';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export async function GET(request: Request) {
  // If we're in a static export (browser), return a mock response
  if (isBrowser) {
    return new Response(
      JSON.stringify({ 
        message: 'This API route is not available in static exports',
        mockData: true 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  
  // If conversationId is provided, return the specific conversation
  if (conversationId) {
    const convId = parseInt(conversationId);
    const conversation = mockConversations.find(c => c.id === convId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    // Get the messages for this conversation
    const messages = mockMessages[convId as keyof typeof mockMessages] || [];
    
    return NextResponse.json({
      conversation,
      messages
    });
  }
  
  // Return all conversations
  return NextResponse.json(mockConversations);
}

export async function POST(request: Request) {
  // If we're in a static export (browser), return a mock response
  if (isBrowser) {
    return new Response(
      JSON.stringify({ 
        message: 'This API route is not available in static exports',
        mockData: true 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { conversationId, message } = await request.json();
    
    // Validate required fields
    if (!conversationId || !message || !message.text) {
      return NextResponse.json(
        { error: 'Conversation ID and message text are required' },
        { status: 400 }
      );
    }
    
    // Check if conversation exists
    const convId = parseInt(conversationId);
    if (!mockMessages[convId as keyof typeof mockMessages]) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Create a new message
    const newMessage = {
      id: mockMessages[convId as keyof typeof mockMessages].length + 1,
      senderId: 'me', // Assuming it's from the current user
      text: message.text,
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    
    // In a real app, this would save to a database
    // and potentially trigger a real-time notification
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  // If we're in a static export (browser), return a mock response
  if (isBrowser) {
    return new Response(
      JSON.stringify({ 
        message: 'This API route is not available in static exports',
        mockData: true 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { conversationId } = await request.json();
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    // Find the conversation
    const convId = parseInt(conversationId);
    const conversation = mockConversations.find(c => c.id === convId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Mark all messages as read
    // In a real app, this would update the database
    
    return NextResponse.json(
      { success: true, message: 'All messages marked as read' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 