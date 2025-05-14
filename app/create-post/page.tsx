'use client';

import { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PostsService, type Post } from '@/lib/services/local-storage-service';
import { uploadImage, generatePlaceholderImage } from '@/lib/services/image-service';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCover, setBookCover] = useState<File | null>(null);
  const [bookCoverPreview, setBookCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);

  // Check for authentication
  useEffect(() => {
    const userString = localStorage.getItem('bookTok_currentUser');
    if (!userString) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userString);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBookCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookCover(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setBookCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a post');
      return;
    }
    
    // Validate post content
    if (!content) {
      setError('Please enter some text for your post');
      return;
    }
    
    // If book information is provided, both title and author are required
    if ((bookTitle && !bookAuthor) || (!bookTitle && bookAuthor)) {
      setError('Please provide both book title and author');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      let imageUrl;
      let bookCoverUrl;
      
      // Upload image if provided
      if (image) {
        imageUrl = await uploadImage(image);
      }
      
      // Upload book cover if provided
      if (bookCover) {
        bookCoverUrl = await uploadImage(bookCover);
      }
      
      // Create the post object
      const postData: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'likedBy'> = {
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar || generatePlaceholderImage(currentUser.username, 64, 64),
        content,
        imageUrl: imageUrl || undefined,
        bookTitle: bookTitle || undefined,
        bookAuthor: bookAuthor || undefined,
        bookCover: bookCoverUrl || undefined,
      };
      
      // Save post
      const newPost = PostsService.createPost(postData);
      
      // Navigate back to feed
      router.push('/feed');
      
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-[var(--text-secondary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Post</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Post Content */}
          <div className="mb-6">
            <label htmlFor="post-content" className="block mb-2 text-[var(--text-primary)] font-medium">What's on your mind?</label>
            <textarea
              id="post-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              placeholder="Share your thoughts about a book you're reading..."
              required
            />
          </div>

          {/* Post Image */}
          <div className="mb-6">
            <label className="block mb-2 text-[var(--text-primary)] font-medium">Add Image (optional)</label>
            <div 
              className="border-2 border-dashed border-[var(--card-border)] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-color)] transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full">
                  <Image 
                    src={imagePreview}
                    alt="Image preview"
                    width={500}
                    height={300}
                    className="w-full h-auto max-h-64 object-contain rounded-md"
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setImagePreview(null);
                      if (imageInputRef.current) {
                        imageInputRef.current.value = '';
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Click to upload an image</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">JPG, PNG or GIF</p>
                </>
              )}
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Book Details Section */}
          <div className="mb-6 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">Add Book Details (optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Book Cover */}
              <div className="md:col-span-1">
                <label className="block mb-2 text-sm text-[var(--text-primary)]">Book Cover</label>
                <div 
                  className="aspect-[2/3] border-2 border-dashed border-[var(--card-border)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-color)] transition-colors"
                  onClick={() => bookCoverInputRef.current?.click()}
                >
                  {bookCoverPreview ? (
                    <div className="w-full h-full relative">
                      <Image 
                        src={bookCoverPreview}
                        alt="Book cover preview"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-md"
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookCover(null);
                          setBookCoverPreview(null);
                          if (bookCoverInputRef.current) {
                            bookCoverInputRef.current.value = '';
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="mt-2 text-xs text-[var(--text-secondary)]">Upload cover</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={bookCoverInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBookCoverChange}
                  />
                </div>
              </div>
              
              {/* Book Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label htmlFor="book-title" className="block mb-1 text-sm text-[var(--text-primary)]">
                    Book Title
                  </label>
                  <input
                    id="book-title"
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    placeholder="Enter book title"
                  />
                </div>
                
                <div>
                  <label htmlFor="book-author" className="block mb-1 text-sm text-[var(--text-primary)]">
                    Author
                  </label>
                  <input
                    id="book-author"
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    placeholder="Enter author name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-[var(--card-border)] rounded-md text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--background)] focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-opacity-90 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 