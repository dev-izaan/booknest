'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';
import Image from 'next/image';

export default function CreatePost() {
  const router = useRouter();
  const { user, loading } = useFirebase();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Redirect if user is not logged in
  if (!loading && !user) {
      router.push('/login');
    return null;
    }
    
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImage(file);
    
    // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
      setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!user) {
      setError('You must be logged in to create a post');
      console.log("Error: User not logged in");
      return;
    }
    
    if (!title || !author || !description || !genre || !coverImage) {
      setError('Please fill out all fields and upload a cover image');
      console.log("Error: Missing required fields", { title, author, description, genre, coverImage });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log("Starting image upload");
      // 1. Upload cover image to Firebase Storage
      let imageUrl;
      
      try {
        const { uploadFile, generateFilePath } = await import('@/lib/services/storage');
        const filePath = generateFilePath(user.uid, `book-covers/${coverImage.name}`);
        console.log("Generated file path:", filePath);
        
        imageUrl = await uploadFile(coverImage, filePath);
        console.log("Image uploaded successfully, URL:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // Use a placeholder image if upload fails
        imageUrl = "https://picsum.photos/400/600"; // Placeholder image
        setError('Warning: Image upload failed - using placeholder image instead. The book will still be created.');
      }
      
      console.log("Saving book data to Firestore");
      // 2. Save book data to Firestore
      try {
        const { setDocument } = await import('@/lib/services/firestore');
        const bookId = crypto.randomUUID();
        console.log("Generated book ID:", bookId);
        
        await setDocument('books', bookId, {
          title,
          author,
          description,
          genre,
          coverUrl: imageUrl,
          userId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 0,
          ratingCount: 0,
          reviewCount: 0
        });
        console.log("Book data saved to Firestore");
        
        // 3. Also add to the user's books collection
        await setDocument(`users/${user.uid}/books`, bookId, {
          bookId,
          status: 'shared',
          addedAt: new Date().toISOString()
        });
        console.log("Book reference added to user's books collection");
        
        // 4. Redirect to the book page
        console.log("Redirecting to book page:", `/book/${bookId}`);
        router.push(`/book/${bookId}`);
      } catch (firestoreError) {
        console.error("Error saving to Firestore:", firestoreError);
        setError('Failed to save book data to database. Please ensure you have proper permissions.');
        setIsSubmitting(false);
      }
      
    } catch (err) {
      console.error('Error creating book:', err);
      setError('Failed to create book. Please try again. Error: ' + (err instanceof Error ? err.message : String(err)));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold mb-8">Share a Book</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
                  </div>
                )}
                
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Cover upload */}
          <div className="col-span-1">
            <div 
              className="aspect-[2/3] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
            >
              {coverPreview ? (
                <div className="w-full h-full relative">
                      <Image 
                    src={coverPreview}
                    alt="Cover preview"
                        fill
                        style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImage(null);
                      setCoverPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Upload cover image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
                      />
                    </div>
                  </div>
          
          {/* Right side - Book details */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
                <input
                id="author"
                  type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                required
              >
                <option value="">Select genre</option>
                <option value="fantasy">Fantasy</option>
                <option value="science-fiction">Science Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="biography">Biography</option>
                <option value="history">History</option>
                <option value="self-help">Self-Help</option>
                <option value="young-adult">Young Adult</option>
                <option value="children">Children's</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Share Book'}
          </button>
        </div>
      </form>
    </div>
  );
} 