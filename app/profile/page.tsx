'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/contexts/FirebaseContext';

// Define types for book objects
interface Book {
  id: string | number;
  title: string;
  author: string;
  cover: string;
  rating?: number;
  progress?: number;
}

// Define type for user data
interface UserData {
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joined: string;
  avatar: string;
  coverImage: string;
  favoriteGenres: string[];
  stats: {
    books: number;
    reviews: number;
    followers: number;
    following: number;
  };
  recentlyRead: Book[];
  currentlyReading: Book[];
  wantToRead: Book[];
  createdAt?: string;
  updatedAt?: string;
}

// Default user data structure
const defaultUserData: UserData = {
  name: '',
  username: '',
  email: '',
  bio: 'Book lover and reader',
  location: '',
  website: '',
  joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
  coverImage: 'https://picsum.photos/id/173/1200/300',
  favoriteGenres: ['Fiction'],
  stats: {
    books: 0,
    reviews: 0,
    followers: 0,
    following: 0,
  },
  recentlyRead: [],
  currentlyReading: [],
  wantToRead: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useFirebase();
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data from Firestore when user is authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return;
      }

      try {
        const { getDocumentById } = await import('@/lib/services/firestore');
        const userDoc = await getDocumentById('users', user.uid);
        
        if (userDoc) {
          // Format the data
          const formattedUserData: UserData = {
            ...defaultUserData,
            ...userDoc as Partial<UserData>,
            email: user.email || '',
            joined: new Date(userDoc.createdAt as string || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            }),
          };
          
          setUserData(formattedUserData);
          setNewBio(formattedUserData.bio || '');
        } else {
          // If no user document exists, create one with default values
          const { setDocument } = await import('@/lib/services/firestore');
          await setDocument('users', user.uid, {
            name: user.displayName || '',
            email: user.email || '',
            username: user.displayName?.toLowerCase().replace(/\s+/g, '') || '',
            avatar: user.photoURL || defaultUserData.avatar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchUserData();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // Handle profile image upload
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      const { uploadFile, generateFilePath } = await import('@/lib/services/storage');
      
      // Generate a path for the file
      const filePath = generateFilePath(user.uid, `profile/${file.name}`);
      
      // Upload file and get the URL
      const url = await uploadFile(file, filePath);
      
      // Update user profile in Firestore
      const { updateDocument } = await import('@/lib/services/firestore');
      await updateDocument('users', user.uid, { 
        avatar: url,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        avatar: url
      }));
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle bio update
  const handleBioUpdate = async () => {
    if (!user) return;
    
    try {
      const { updateDocument } = await import('@/lib/services/firestore');
      await updateDocument('users', user.uid, { 
        bio: newBio,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        bio: newBio
      }));
      
      // Exit edit mode
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio. Please try again.');
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="h-56 w-full relative">
        <Image 
          src={userData.coverImage} 
          alt="Cover image"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-lg shadow p-6 pt-20">
            <div className="absolute -top-16 left-6 h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {uploadingImage ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <div className="spinner-small"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
              <Image 
                src={userData.avatar} 
                alt={userData.name || 'Profile'}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageUpload}
                disabled={uploadingImage}
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold mb-1">{userData.name || 'Book Lover'}</h1>
                <p className="text-gray-500 mb-3">@{userData.username || 'booklover'}</p>
                
                {isEditingBio ? (
                  <div className="mb-4">
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={handleBioUpdate}
                        className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingBio(false);
                          setNewBio(userData.bio || '');
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative mb-4 group">
                    <p className="text-gray-700 max-w-3xl pr-8">{userData.bio || 'Tell us about yourself...'}</p>
                    <button 
                      onClick={() => setIsEditingBio(true)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {userData.location && (
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {userData.location}
                    </div>
                  )}
                  
                  {userData.website && (
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a href={`https://${userData.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {userData.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Joined {userData.joined}
                  </div>
                </div>
                
                <div className="flex space-x-6 text-sm mb-6">
                  <div>
                    <span className="font-bold text-gray-900">{userData.stats.books}</span>{' '}
                    <span className="text-gray-600">Books</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{userData.stats.reviews}</span>{' '}
                    <span className="text-gray-600">Reviews</span>
                  </div>
                  <Link href="/profile/followers" className="hover:underline">
                    <span className="font-bold text-gray-900">{userData.stats.followers}</span>{' '}
                    <span className="text-gray-600">Followers</span>
                  </Link>
                  <Link href="/profile/following" className="hover:underline">
                    <span className="font-bold text-gray-900">{userData.stats.following}</span>{' '}
                    <span className="text-gray-600">Following</span>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {userData.favoriteGenres && userData.favoriteGenres.map((genre, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-col space-y-3">
                <Link href="/profile/edit" className="btn-primary block text-center">
                  Edit Profile
                </Link>
                <button
                  onClick={async () => {
                    try {
                      // Sign out the user
                      const { logoutUser } = await import('@/lib/services/firebase-auth');
                      await logoutUser();
                      
                      // Redirect to login page
                      router.push('/login');
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="btn-secondary block text-center"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for Books, Reviews, etc. */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 md:px-8 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('books')}
              >
                Books
              </button>
              <button
                className={`py-4 px-6 md:px-8 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
              <button
                className={`py-4 px-6 md:px-8 border-b-2 font-medium text-sm ${
                  activeTab === 'lists'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('lists')}
              >
                Lists
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'books' && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Currently Reading</h2>
                    <Link href="/bookshelf" className="text-sm text-primary-600 hover:text-primary-700">
                      View All
                    </Link>
                  </div>
                  
                  {userData.currentlyReading && userData.currentlyReading.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {userData.currentlyReading.map(book => (
                        <div key={book.id} className="flex flex-col">
                          <div className="relative h-56 rounded-md overflow-hidden shadow-sm">
                            <Image
                              src={book.cover}
                              alt={book.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 px-2">
                              <div className="text-xs text-white">{book.progress}% complete</div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-primary-500 h-1 rounded-full"
                                  style={{ width: `${book.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <h3 className="mt-2 font-medium text-sm line-clamp-1">{book.title}</h3>
                          <p className="text-gray-600 text-xs line-clamp-1">{book.author}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No books currently being read</p>
                      <Link href="/books" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                        Find something to read
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Recently Read</h2>
                    <Link href="/bookshelf?shelf=read" className="text-sm text-primary-600 hover:text-primary-700">
                      View All
                    </Link>
                  </div>
                  
                  {userData.recentlyRead && userData.recentlyRead.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {userData.recentlyRead.map(book => (
                        <div key={book.id} className="flex flex-col">
                          <div className="relative h-56 rounded-md overflow-hidden shadow-sm">
                            <Image
                              src={book.cover}
                              alt={book.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                            {book.rating && (
                              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full text-xs px-2 py-1 font-medium">
                                {book.rating} ★
                              </div>
                            )}
                          </div>
                          <h3 className="mt-2 font-medium text-sm line-clamp-1">{book.title}</h3>
                          <p className="text-gray-600 text-xs line-clamp-1">{book.author}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No books read yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Your reviews will appear here</p>
              </div>
            )}
            
            {activeTab === 'lists' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No lists created yet</p>
                <Link href="/lists/create" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                  Create your first book list
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 