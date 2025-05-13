'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileNavBar from '@/components/MobileNavBar';

// Mock book data
const mockBooks = [
  {
    id: 1001,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://picsum.photos/id/24/400/600',
    synopsis: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
    publicationDate: 'August 13, 2020',
    publisher: 'Viking',
    genres: ['Fiction', 'Fantasy', 'Science Fiction', 'Self Help'],
    pages: 304,
    isbn: '9780525559474',
    rating: 4.2,
    ratingsCount: 1245,
    description: 'A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.',
    reviews: [
      {
        id: 101,
        user: {
          name: 'Jane Austen',
          username: 'janeausten',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        rating: 5,
        text: 'Absolutely loved this book! The concept is fascinating and the execution is beautiful. It really makes you think about the choices we make and how they shape our lives.',
        date: '2 months ago',
        likes: 42,
      },
      {
        id: 102,
        user: {
          name: 'Ernest Hemingway',
          username: 'ehemingway',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        rating: 4,
        text: 'A thought-provoking read. While the concept isn\'t entirely new, Haig brings a fresh perspective and emotional depth to the story. Highly recommend for anyone going through a tough time.',
        date: '3 months ago',
        likes: 28,
      },
      {
        id: 103,
        user: {
          name: 'Virginia Woolf',
          username: 'vwoolf',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        },
        rating: 3,
        text: 'While beautifully written, I found the message a bit too on-the-nose at times. Still, it\'s a compelling story with interesting philosophical questions.',
        date: '5 months ago',
        likes: 15,
      },
    ],
    relatedPosts: [
      {
        id: 1,
        type: 'photo',
        author: {
          name: 'Jane Austen',
          username: 'janeausten',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        content: 'Just got this beautiful edition of "The Midnight Library" - the cover art is stunning! #bookhaul',
        media: 'https://picsum.photos/id/24/600/800',
        likes: 142,
        comments: 38,
        timestamp: '2 weeks ago',
      },
      {
        id: 2,
        type: 'quote',
        author: {
          name: 'Franz Kafka',
          username: 'fkafka',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        },
        content: '"Between life and death there is a library, and within that library, the shelves go on forever."',
        likes: 215,
        comments: 47,
        timestamp: '1 month ago',
      },
    ],
    similarBooks: [
      {
        id: 1002,
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        cover: 'https://picsum.photos/id/25/200/300',
        rating: 4.0,
      },
      {
        id: 1003,
        title: 'A Little Life',
        author: 'Hanya Yanagihara',
        cover: 'https://picsum.photos/id/26/200/300',
        rating: 5.0,
      },
      {
        id: 1004,
        title: 'Cloud Cuckoo Land',
        author: 'Anthony Doerr',
        cover: 'https://picsum.photos/id/27/200/300',
        rating: 4.5,
      },
    ],
  },
];

export default function BookPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'reviews', 'posts'
  
  useEffect(() => {
    // In a real app, we would fetch book data based on the ID
    // For now, we'll use mock data
    const foundBook = mockBooks.find(b => b.id === parseInt(id));
    
    if (foundBook) {
      setBook(foundBook);
      setIsLoading(false);
    } else {
      // If book not found, redirect to 404 or books list
      router.push('/books');
    }
  }, [id, router]);

  if (isLoading || !book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Book header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-72 shadow-lg">
                <Image 
                  src={book.cover} 
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8 mt-6 md:mt-0">
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
              
              <div className="flex items-center mt-3">
                {Array(5).fill().map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < Math.floor(book.rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} color={i < Math.floor(book.rating) ? '#FBBF24' : '#D1D5DB'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-gray-700">{book.rating}</span>
                <span className="mx-2 text-gray-400">·</span>
                <span className="text-gray-600">{book.ratingsCount} ratings</span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {book.genres.map((genre, index) => (
                  <Link 
                    key={index} 
                    href={`/books/genre/${genre.toLowerCase().replace(' ', '-')}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Publication Date</p>
                  <p>{book.publicationDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Publisher</p>
                  <p>{book.publisher}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pages</p>
                  <p>{book.pages}</p>
                </div>
                <div>
                  <p className="text-gray-500">ISBN</p>
                  <p>{book.isbn}</p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Library
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex">
            <button 
              className={`px-6 py-3 text-sm font-medium text-center ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium text-center ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium text-center ${activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('posts')}
            >
              Related Posts
            </button>
          </div>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'about' && (
          <div>
            <h2 className="text-xl font-bold">Synopsis</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">{book.synopsis}</p>
            
            <h2 className="text-xl font-bold mt-8">Similar Books</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {book.similarBooks.map((similarBook) => (
                <Link key={similarBook.id} href={`/book/${similarBook.id}`} className="group">
                  <div className="relative h-56 shadow-md rounded overflow-hidden group-hover:opacity-90 transition-opacity">
                    <Image
                      src={similarBook.cover}
                      alt={similarBook.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium group-hover:text-blue-600">{similarBook.title}</h3>
                  <p className="text-xs text-gray-600">{similarBook.author}</p>
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs ml-1 text-gray-600">{similarBook.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Reviews</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Write a Review
              </button>
            </div>
            
            <div className="mt-6 space-y-6">
              {book.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start">
                    <Image 
                      src={review.user.avatar} 
                      alt={review.user.name} 
                      width={40} 
                      height={40} 
                      className="rounded-full mr-3" 
                    />
                    <div>
                      <div className="flex items-center">
                        <Link href={`/profile/${review.user.username}`} className="font-semibold hover:underline">{review.user.name}</Link>
                        <span className="mx-2 text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {Array(5).fill().map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} color={i < review.rating ? '#FBBF24' : '#D1D5DB'}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700">{review.text}</p>
                      <div className="mt-3 flex items-center text-gray-500 text-sm">
                        <button className="flex items-center hover:text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Helpful ({review.likes})
                        </button>
                        <button className="ml-4 hover:text-blue-500">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Load More Reviews
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div>
            <h2 className="text-xl font-bold">Related Posts</h2>
            
            <div className="mt-6 space-y-6">
              {book.relatedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Post header */}
                  <div className="flex items-center p-4">
                    <Image 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      width={40} 
                      height={40} 
                      className="rounded-full mr-3" 
                    />
                    <div>
                      <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm">{post.author.name}</Link>
                      <p className="text-gray-500 text-xs">{post.timestamp}</p>
                    </div>
                  </div>
                  
                  {/* Post content */}
                  <div className="px-4 py-2">
                    <p className="text-sm">{post.content}</p>
                  </div>
                  
                  {/* Post media */}
                  {post.type === 'photo' && post.media && (
                    <div className="relative pt-[75%]">
                      <Image 
                        src={post.media} 
                        alt="Post image"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="w-full h-full absolute top-0 left-0"
                      />
                    </div>
                  )}
                  
                  {/* Post actions */}
                  <div className="flex items-center px-4 py-2 border-t border-gray-100">
                    <button className="flex items-center text-gray-500 mr-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs ml-1">{post.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs ml-1">{post.comments}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                See More Posts
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar activePage="none" />
    </div>
  );
} 