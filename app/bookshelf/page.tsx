'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock Data
const mockBookshelves = [
  {
    id: 'currently-reading',
    name: 'Currently Reading',
    description: 'Books you are currently reading',
    count: 1,
    books: [
      {
        id: 4,
        title: 'Cloud Cuckoo Land',
        author: 'Anthony Doerr',
        cover: 'https://picsum.photos/id/27/200/300',
        progress: 62,
        dateAdded: '2023-05-15',
      },
    ],
  },
  {
    id: 'read',
    name: 'Read',
    description: 'Books you have finished reading',
    count: 78,
    books: [
      {
        id: 1,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        cover: 'https://picsum.photos/id/24/200/300',
        rating: 4.5,
        dateRead: '2023-04-20',
      },
      {
        id: 2,
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        cover: 'https://picsum.photos/id/25/200/300',
        rating: 4.0,
        dateRead: '2023-03-12',
      },
      {
        id: 3,
        title: 'A Little Life',
        author: 'Hanya Yanagihara',
        cover: 'https://picsum.photos/id/26/200/300',
        rating: 5.0,
        dateRead: '2023-02-05',
      },
      {
        id: 7,
        title: 'The Vanishing Half',
        author: 'Brit Bennett',
        cover: 'https://picsum.photos/id/30/200/300',
        rating: 4.8,
        dateRead: '2023-01-18',
      },
      {
        id: 8,
        title: 'Anxious People',
        author: 'Fredrik Backman',
        cover: 'https://picsum.photos/id/31/200/300',
        rating: 4.3,
        dateRead: '2022-12-24',
      },
    ],
  },
  {
    id: 'want-to-read',
    name: 'Want to Read',
    description: 'Books you want to read in the future',
    count: 42,
    books: [
      {
        id: 5,
        title: 'The Lincoln Highway',
        author: 'Amor Towles',
        cover: 'https://picsum.photos/id/28/200/300',
        dateAdded: '2023-05-01',
      },
      {
        id: 6,
        title: 'Matrix',
        author: 'Lauren Groff',
        cover: 'https://picsum.photos/id/29/200/300',
        dateAdded: '2023-04-28',
      },
      {
        id: 9,
        title: 'Sea of Tranquility',
        author: 'Emily St. John Mandel',
        cover: 'https://picsum.photos/id/32/200/300',
        dateAdded: '2023-04-15',
      },
      {
        id: 10,
        title: 'To Paradise',
        author: 'Hanya Yanagihara',
        cover: 'https://picsum.photos/id/33/200/300',
        dateAdded: '2023-04-10',
      },
      {
        id: 11,
        title: 'The School for Good Mothers',
        author: 'Jessamine Chan',
        cover: 'https://picsum.photos/id/34/200/300',
        dateAdded: '2023-04-05',
      },
    ],
  },
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'Your favorite books of all time',
    count: 15,
    books: [
      {
        id: 12,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: 'https://picsum.photos/id/35/200/300',
        rating: 5.0,
      },
      {
        id: 13,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: 'https://picsum.photos/id/36/200/300',
        rating: 5.0,
      },
      {
        id: 14,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: 'https://picsum.photos/id/37/200/300',
        rating: 5.0,
      },
      {
        id: 15,
        title: '1984',
        author: 'George Orwell',
        cover: 'https://picsum.photos/id/38/200/300',
        rating: 5.0,
      },
      {
        id: 3,
        title: 'A Little Life',
        author: 'Hanya Yanagihara',
        cover: 'https://picsum.photos/id/26/200/300',
        rating: 5.0,
      },
    ],
  },
];

export default function BookshelfPage() {
  const router = useRouter();
  const [activeShelf, setActiveShelf] = useState('currently-reading');
  const [displayMode, setDisplayMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication status (would use a proper auth hook in real app)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const currentShelf = mockBookshelves.find(shelf => shelf.id === activeShelf);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Bookshelves</h1>
          <button className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Book
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4">My Shelves</h2>
              <nav className="space-y-1">
                {mockBookshelves.map(shelf => (
                  <button
                    key={shelf.id}
                    className={`flex items-center justify-between w-full p-3 rounded-md ${activeShelf === shelf.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => setActiveShelf(shelf.id)}
                  >
                    <span className="font-medium">{shelf.name}</span>
                    <span className="text-sm bg-gray-100 rounded-full px-2 py-0.5">{shelf.count}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t">
                <button className="text-primary-600 hover:text-primary-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Shelf
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <h2 className="text-lg font-bold mb-4">Reading Stats</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Books read this year</div>
                  <div className="text-2xl font-bold">23</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Reading goal</div>
                  <div className="text-2xl font-bold">50 books</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">46% complete</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Pages read</div>
                  <div className="text-2xl font-bold">7,842</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Shelf Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{currentShelf?.name}</h2>
                  <p className="text-gray-500">{currentShelf?.description}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      className={`p-2 ${displayMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                      onClick={() => setDisplayMode('grid')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      className={`p-2 ${displayMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                      onClick={() => setDisplayMode('list')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <select className="border rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Sort by: Date Added</option>
                    <option>Sort by: Title</option>
                    <option>Sort by: Author</option>
                    <option>Sort by: Rating</option>
                  </select>
                </div>
              </div>
              
              {/* Grid View */}
              {displayMode === 'grid' && (
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {currentShelf?.books.map((book) => (
                      <div key={book.id} className="group">
                        <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-md mb-2 group-hover:shadow-lg transition-shadow">
                          <Image 
                            src={book.cover} 
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                          {'progress' in book && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                              <div className="w-full bg-gray-300 rounded-full h-1.5">
                                <div className="bg-white h-1.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                              </div>
                              <div className="text-white text-xs text-center mt-1">{book.progress}%</div>
                            </div>
                          )}
                          {'rating' in book && (
                            <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                              <div className="flex items-center text-yellow-400 text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1">{book.rating}</span>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white rounded-full p-1.5 shadow hover:bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                    ))}
                    
                    {/* Add New Book Card */}
                    <div className="flex flex-col items-center justify-center aspect-[2/3] rounded-md border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors cursor-pointer p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="mt-2 text-sm font-medium text-gray-600">Add New Book</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* List View */}
              {displayMode === 'list' && (
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        {'rating' in (currentShelf?.books[0] || {}) && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                        )}
                        {'progress' in (currentShelf?.books[0] || {}) && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                        )}
                        {'dateRead' in (currentShelf?.books[0] || {}) && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Read
                          </th>
                        )}
                        {'dateAdded' in (currentShelf?.books[0] || {}) && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Added
                          </th>
                        )}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentShelf?.books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded mr-3">
                                <Image 
                                  src={book.cover} 
                                  alt={book.title}
                                  width={48}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.author}
                          </td>
                          {'rating' in book && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-yellow-400 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1">{book.rating}</span>
                              </div>
                            </td>
                          )}
                          {'progress' in book && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{book.progress}% complete</div>
                            </td>
                          )}
                          {'dateRead' in book && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.dateRead}
                            </td>
                          )}
                          {'dateAdded' in book && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.dateAdded}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 