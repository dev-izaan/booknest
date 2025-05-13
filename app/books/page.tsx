'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';

// Mock genre data
const mockGenres = [
  { id: 1, name: 'Fantasy', icon: '🧙‍♂️', count: 1245 },
  { id: 2, name: 'Science Fiction', icon: '🚀', count: 987 },
  { id: 3, name: 'Mystery', icon: '🕵️‍♀️', count: 1432 },
  { id: 4, name: 'Thriller', icon: '😱', count: 856 },
  { id: 5, name: 'Romance', icon: '❤️', count: 2145 },
  { id: 6, name: 'Young Adult', icon: '👨‍👩‍👧‍👦', count: 1567 },
  { id: 7, name: 'Historical Fiction', icon: '📜', count: 765 },
  { id: 8, name: 'Non-fiction', icon: '📚', count: 1876 },
  { id: 9, name: 'Biography', icon: '👤', count: 654 },
  { id: 10, name: 'Self-help', icon: '🧘‍♀️', count: 987 },
  { id: 11, name: 'Horror', icon: '👻', count: 543 },
  { id: 12, name: 'Classics', icon: '🏛️', count: 876 },
];

// Mock trending books
const mockTrendingBooks = [
  {
    id: 1001,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://picsum.photos/id/24/400/600',
    rating: 4.2,
    ratingsCount: 1245,
    trending: 1,
  },
  {
    id: 1002,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    cover: 'https://picsum.photos/id/25/400/600',
    rating: 4.0,
    ratingsCount: 987,
    trending: 2,
  },
  {
    id: 1003,
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    cover: 'https://picsum.photos/id/26/400/600',
    rating: 5.0,
    ratingsCount: 2134,
    trending: 3,
  },
  {
    id: 1004,
    title: 'Cloud Cuckoo Land',
    author: 'Anthony Doerr',
    cover: 'https://picsum.photos/id/27/400/600',
    rating: 4.5,
    ratingsCount: 876,
    trending: 4,
  },
  {
    id: 1005,
    title: 'The Lincoln Highway',
    author: 'Amor Towles',
    cover: 'https://picsum.photos/id/28/400/600',
    rating: 4.3,
    ratingsCount: 765,
    trending: 5,
  },
];

// Mock book lists
const mockBookLists = [
  {
    id: 1,
    title: 'Best Books of 2023',
    description: 'The top-rated books published this year',
    books: [
      {
        id: 1007,
        title: 'Tomorrow, and Tomorrow, and Tomorrow',
        author: 'Gabrielle Zevin',
        cover: 'https://picsum.photos/id/30/200/300',
        rating: 4.7,
      },
      {
        id: 1008,
        title: 'Sea of Tranquility',
        author: 'Emily St. John Mandel',
        cover: 'https://picsum.photos/id/31/200/300',
        rating: 4.4,
      },
      {
        id: 1009,
        title: 'How High We Go in the Dark',
        author: 'Sequoia Nagamatsu',
        cover: 'https://picsum.photos/id/32/200/300',
        rating: 4.2,
      },
      {
        id: 1010,
        title: 'The Candy House',
        author: 'Jennifer Egan',
        cover: 'https://picsum.photos/id/33/200/300',
        rating: 4.1,
      },
    ],
  },
  {
    id: 2,
    title: 'Top Romance Picks',
    description: 'Heart-fluttering reads for romance lovers',
    books: [
      {
        id: 1011,
        title: 'Book Lovers',
        author: 'Emily Henry',
        cover: 'https://picsum.photos/id/34/200/300',
        rating: 4.5,
      },
      {
        id: 1012,
        title: 'People We Meet on Vacation',
        author: 'Emily Henry',
        cover: 'https://picsum.photos/id/35/200/300',
        rating: 4.3,
      },
      {
        id: 1013,
        title: 'The Love Hypothesis',
        author: 'Ali Hazelwood',
        cover: 'https://picsum.photos/id/36/200/300',
        rating: 4.6,
      },
      {
        id: 1014,
        title: 'One Last Stop',
        author: 'Casey McQuiston',
        cover: 'https://picsum.photos/id/37/200/300',
        rating: 4.2,
      },
    ],
  },
  {
    id: 3,
    title: 'If You Liked "The Midnight Library"',
    description: 'Similar books to Matt Haig\'s bestseller',
    books: [
      {
        id: 1015,
        title: 'The Invisible Life of Addie LaRue',
        author: 'V.E. Schwab',
        cover: 'https://picsum.photos/id/38/200/300',
        rating: 4.4,
      },
      {
        id: 1016,
        title: 'Anxious People',
        author: 'Fredrik Backman',
        cover: 'https://picsum.photos/id/39/200/300',
        rating: 4.5,
      },
      {
        id: 1017,
        title: 'Before the Coffee Gets Cold',
        author: 'Toshikazu Kawaguchi',
        cover: 'https://picsum.photos/id/40/200/300',
        rating: 4.0,
      },
      {
        id: 1018,
        title: 'The Starless Sea',
        author: 'Erin Morgenstern',
        cover: 'https://picsum.photos/id/41/200/300',
        rating: 4.3,
      },
    ],
  },
];

export default function BooksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Check authentication status (would use a proper auth hook in real app)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Discover Books</h1>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books, authors, or ISBN"
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 text-blue-600 font-medium"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Quick genre filters */}
          <div className="mt-4 flex overflow-x-auto pb-2 gap-2">
            {mockGenres.slice(0, 8).map((genre) => (
              <Link key={genre.id} href={`/books/genre/${genre.name.toLowerCase().replace(' ', '-')}`} className="flex-shrink-0">
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <span>{genre.icon} {genre.name}</span>
                </div>
              </Link>
            ))}
            <Link href="/books/genres" className="flex-shrink-0">
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                <span>More...</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Trending Books */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Trending This Week</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockTrendingBooks.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className="group">
                <div className="relative">
                  <div className="relative h-64 shadow-md rounded overflow-hidden group-hover:opacity-90 transition-opacity">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  {book.trending <= 3 && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      #{book.trending}
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium group-hover:text-blue-600">{book.title}</h3>
                <p className="text-xs text-gray-600">{book.author}</p>
                <div className="flex items-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs ml-1 text-gray-600">{book.rating} ({book.ratingsCount})</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/books/trending" className="text-blue-600 text-sm font-medium hover:underline">
              See all trending books
            </Link>
          </div>
        </section>
        
        {/* Curated Lists */}
        {mockBookLists.map((list) => (
          <section key={list.id} className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{list.title}</h2>
                <p className="text-sm text-gray-600">{list.description}</p>
              </div>
              <Link href={`/books/list/${list.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.books.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`} className="group">
                  <div className="flex">
                    <div className="relative h-32 w-20 shadow-md rounded overflow-hidden group-hover:opacity-90 transition-opacity">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                      />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <h3 className="text-sm font-medium group-hover:text-blue-600">{book.title}</h3>
                      <p className="text-xs text-gray-600">{book.author}</p>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs ml-1 text-gray-600">{book.rating}</span>
                      </div>
                      <button className="mt-auto text-xs text-blue-600 font-medium">Add to Library</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        
        {/* Explore by Genre */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Explore by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockGenres.map((genre) => (
              <Link key={genre.id} href={`/books/genre/${genre.name.toLowerCase().replace(' ', '-')}`}>
                <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{genre.icon}</div>
                  <h3 className="font-medium">{genre.name}</h3>
                  <p className="text-xs text-gray-600">{genre.count} books</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* AI Recommendations */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h2 className="text-xl font-bold">AI Book Recommendations</h2>
                <p className="text-white text-opacity-90">Get personalized book suggestions based on your reading history</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
              Get Started
            </button>
          </div>
        </section>
      </div>
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar activePage="books" />
    </div>
  );
} 