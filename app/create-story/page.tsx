'use client';

import { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { StoriesService, type Story } from '@/lib/services/local-storage-service';
import { uploadImage, generatePlaceholderImage } from '@/lib/services/image-service';

enum StoryType {
  TEXT = 'text',
  IMAGE = 'image',
  BOOK = 'book'
}

export default function CreateStoryPage() {
  const router = useRouter();
  const [storyType, setStoryType] = useState<StoryType>(StoryType.TEXT);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCover, setBookCover] = useState<File | null>(null);
  const [bookCoverPreview, setBookCoverPreview] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6'); // Default blue
  const [textColor, setTextColor] = useState('#ffffff'); // Default white
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);
  
  // Background color options
  const bgColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#000000', // Black
  ];
  
  // Text color options
  const txtColors = [
    '#ffffff', // White
    '#f3f4f6', // Light gray
    '#000000', // Black
    '#1f2937', // Dark gray
  ];

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
      setError('You must be logged in to create a story');
      return;
    }
    
    // Validate based on story type
    if (storyType === StoryType.TEXT && !content) {
      setError('Please enter some text for your story');
      return;
    }
    
    if (storyType === StoryType.IMAGE && !image) {
      setError('Please upload an image for your story');
      return;
    }
    
    if (storyType === StoryType.BOOK && (!bookTitle || !bookAuthor)) {
      setError('Please enter both book title and author');
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
      
      // Create the story object
      const storyData: Omit<Story, 'id' | 'createdAt' | 'expiresAt' | 'viewedBy'> = {
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar || generatePlaceholderImage(currentUser.username, 64, 64),
        type: storyType,
        content: content || undefined,
        imageUrl: imageUrl || undefined,
        bookTitle: bookTitle || undefined,
        bookAuthor: bookAuthor || undefined,
        bookCover: bookCoverUrl || undefined,
        backgroundColor: backgroundColor || undefined,
        textColor: textColor || undefined,
      };
      
      // Save story
      const newStory = StoriesService.createStory(storyData);
      
      // Navigate back to feed
      router.push('/feed');
      
    } catch (error) {
      console.error('Error creating story:', error);
      setError('Failed to create story. Please try again.');
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Story</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Story Type Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-[var(--text-primary)] font-medium">Choose Story Type</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setStoryType(StoryType.TEXT)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  storyType === StoryType.TEXT 
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10' 
                    : 'border-[var(--card-border)] bg-[var(--card-bg)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <span>Text</span>
              </button>
              
              <button
                type="button"
                onClick={() => setStoryType(StoryType.IMAGE)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  storyType === StoryType.IMAGE 
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10' 
                    : 'border-[var(--card-border)] bg-[var(--card-bg)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image</span>
              </button>
              
              <button
                type="button"
                onClick={() => setStoryType(StoryType.BOOK)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  storyType === StoryType.BOOK 
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10' 
                    : 'border-[var(--card-border)] bg-[var(--card-bg)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Book</span>
              </button>
            </div>
          </div>

          {/* Text Story Options */}
          {storyType === StoryType.TEXT && (
            <>
              <div className="mb-6">
                <label htmlFor="text-content" className="block mb-2 text-[var(--text-primary)] font-medium">Story Text</label>
                <textarea
                  id="text-content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder="What's on your mind?"
                  maxLength={200}
                  required
                />
                <div className="mt-1 text-right text-[var(--text-secondary)] text-sm">
                  {content.length}/200
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-primary)] font-medium">Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {bgColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBackgroundColor(color)}
                      className={`w-8 h-8 rounded-full ${backgroundColor === color ? 'ring-2 ring-offset-2 ring-[var(--accent-color)]' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Background color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-primary)] font-medium">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {txtColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTextColor(color)}
                      className={`w-8 h-8 rounded-full ${textColor === color ? 'ring-2 ring-offset-2 ring-[var(--accent-color)]' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Text color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <div className="aspect-[9/16] max-h-80 rounded-lg overflow-hidden shadow-md mx-auto">
                  <div 
                    className="w-full h-full flex items-center justify-center p-4"
                    style={{ backgroundColor, color: textColor }}
                  >
                    <p className="text-xl md:text-2xl text-center">
                      {content || 'Your story preview'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Image Story Options */}
          {storyType === StoryType.IMAGE && (
            <>
              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-primary)] font-medium">Image</label>
                <div 
                  className="aspect-[9/16] max-h-80 border-2 border-dashed border-[var(--card-border)] rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={imagePreview}
                        alt="Story image preview"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="w-full h-full"
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-[var(--text-secondary)]">Tap to upload image</p>
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

              <div className="mb-6">
                <label htmlFor="image-caption" className="block mb-2 text-[var(--text-primary)] font-medium">Caption (optional)</label>
                <textarea
                  id="image-caption"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder="Add a caption to your image"
                  maxLength={100}
                />
                <div className="mt-1 text-right text-[var(--text-secondary)] text-sm">
                  {content.length}/100
                </div>
              </div>
            </>
          )}

          {/* Book Story Options */}
          {storyType === StoryType.BOOK && (
            <>
              <div className="mb-6">
                <label htmlFor="book-title" className="block mb-2 text-[var(--text-primary)] font-medium">Book Title</label>
                <input
                  id="book-title"
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="book-author" className="block mb-2 text-[var(--text-primary)] font-medium">Book Author</label>
                <input
                  id="book-author"
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder="Enter book author"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-primary)] font-medium">Book Cover</label>
                <div className="flex items-start gap-4">
                  <div 
                    className="w-32 h-48 border-2 border-dashed border-[var(--card-border)] rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => bookCoverInputRef.current?.click()}
                  >
                    {bookCoverPreview ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={bookCoverPreview}
                          alt="Book cover preview"
                          fill
                          style={{ objectFit: 'cover' }}
                          className="w-full h-full"
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
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">Tap to upload</p>
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
                  
                  <div className="flex-1">
                    <label htmlFor="book-note" className="block mb-2 text-[var(--text-primary)] font-medium">Your thoughts (optional)</label>
                    <textarea
                      id="book-note"
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                      placeholder="Share your thoughts about this book"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <div className="aspect-[9/16] max-h-80 bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary-color)] rounded-lg overflow-hidden shadow-md p-6 mx-auto">
                  <div className="text-center">
                    <h3 className="text-xl font-serif font-bold mb-2 text-white">Currently Reading</h3>
                    {content && (
                      <p className="text-gray-100 mb-6 max-w-xs mx-auto">{content}</p>
                    )}
                    {bookCoverPreview ? (
                      <div className="max-w-[120px] mx-auto mb-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Image 
                          src={bookCoverPreview}
                          alt={bookTitle || "Book Cover"} 
                          width={120}
                          height={180}
                          className="rounded-md border border-[var(--card-border)]"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-32 bg-gray-300 rounded mx-auto mb-4"></div>
                    )}
                    {(bookTitle || bookAuthor) && (
                      <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-white">
                        {bookTitle} {bookAuthor && `• ${bookAuthor}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Share Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 