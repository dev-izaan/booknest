import { NextResponse } from 'next/server';

const mockBooks = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
    genre: 'Classic',
    rating: 4.5,
    reviewCount: 1247,
  },
  {
    id: '2',
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71hx37UGUIL.jpg',
    genre: 'Literary Fiction',
    rating: 4.3,
    reviewCount: 982,
  },
  {
    id: '3',
    title: 'To the Lighthouse',
    author: 'Virginia Woolf',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91h5xL70jRL.jpg',
    genre: 'Modernist',
    rating: 4.1,
    reviewCount: 763,
  },
  {
    id: '4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91Fq5anJmxL.jpg',
    genre: 'Classic',
    rating: 4.4,
    reviewCount: 1105,
  },
  {
    id: '5',
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91lGOHAMu4L.jpg',
    genre: 'Mystery',
    rating: 4.6,
    reviewCount: 1422,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const genre = searchParams.get('genre');
  
  // Get a single book by ID
  if (id) {
    const book = mockBooks.find(book => book.id === id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(book);
  }
  
  // Filter by genre
  if (genre) {
    const filteredBooks = mockBooks.filter(book => 
      book.genre.toLowerCase() === genre.toLowerCase());
    return NextResponse.json(filteredBooks);
  }
  
  // Return all books
  return NextResponse.json(mockBooks);
}

export async function POST(request: Request) {
  try {
    const book = await request.json();
    
    // Validation (in a real app would be more thorough)
    if (!book.title || !book.author) {
      return NextResponse.json(
        { error: 'Title and author are required' }, 
        { status: 400 }
      );
    }
    
    // In a real app, this would save to a database
    const newBook = {
      id: (mockBooks.length + 1).toString(),
      ...book,
      rating: book.rating || 0,
      reviewCount: 0,
    };
    
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' }, 
      { status: 400 }
    );
  }
} 