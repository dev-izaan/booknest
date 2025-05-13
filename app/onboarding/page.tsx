'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock genre data
const genres = [
  { id: 1, name: 'Fantasy', icon: '🧙‍♂️' },
  { id: 2, name: 'Science Fiction', icon: '🚀' },
  { id: 3, name: 'Mystery', icon: '🕵️‍♀️' },
  { id: 4, name: 'Thriller', icon: '😱' },
  { id: 5, name: 'Romance', icon: '❤️' },
  { id: 6, name: 'Young Adult', icon: '👨‍👩‍👧‍👦' },
  { id: 7, name: 'Historical Fiction', icon: '📜' },
  { id: 8, name: 'Non-fiction', icon: '📚' },
  { id: 9, name: 'Biography', icon: '👤' },
  { id: 10, name: 'Self-help', icon: '🧘‍♀️' },
  { id: 11, name: 'Horror', icon: '👻' },
  { id: 12, name: 'Classics', icon: '🏛️' },
  { id: 13, name: 'Poetry', icon: '🎭' },
  { id: 14, name: 'Contemporary', icon: '🏙️' },
  { id: 15, name: 'Memoir', icon: '📔' },
];

// Mock popular author data
const popularAuthors = [
  { id: 1, name: 'J.K. Rowling' },
  { id: 2, name: 'Stephen King' },
  { id: 3, name: 'Jane Austen' },
  { id: 4, name: 'George R.R. Martin' },
  { id: 5, name: 'Agatha Christie' },
  { id: 6, name: 'Toni Morrison' },
  { id: 7, name: 'Haruki Murakami' },
  { id: 8, name: 'Neil Gaiman' },
  { id: 9, name: 'Brandon Sanderson' },
  { id: 10, name: 'Colleen Hoover' },
  { id: 11, name: 'James Patterson' },
  { id: 12, name: 'Kazuo Ishiguro' },
  { id: 13, name: 'Sally Rooney' },
  { id: 14, name: 'Taylor Jenkins Reid' },
  { id: 15, name: 'George Orwell' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  const [readingGoal, setReadingGoal] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreToggle = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genreId]);
      }
    }
  };

  const handleAuthorToggle = (authorId: number) => {
    if (selectedAuthors.includes(authorId)) {
      setSelectedAuthors(selectedAuthors.filter(id => id !== authorId));
    } else {
      if (selectedAuthors.length < 5) {
        setSelectedAuthors([...selectedAuthors, authorId]);
      }
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to save the user preferences
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-900">Welcome to BookTok!</h1>
          <p className="text-blue-700">Let&apos;s personalize your experience to help you discover books you&apos;ll love.</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-2.5 mb-12 shadow-sm">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        
        {/* Step 1: Genre Selection */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Select your favorite genres</h2>
            <p className="text-blue-700 mb-6">Choose up to 5 genres that interest you the most.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`p-3 rounded-md border flex items-center transition-colors ${
                    selectedGenres.includes(genre.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium shadow-sm'
                      : 'border-gray-300 hover:border-blue-300 text-gray-800 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="text-2xl mr-2">{genre.icon}</span>
                  <span className="font-medium">{genre.name}</span>
                  {selectedGenres.includes(genre.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-blue-700 mb-8">
              Selected: {selectedGenres.length}/5
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedGenres.length === 0}
                className="btn-primary px-6 py-2 disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Author Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Select authors you enjoy</h2>
            <p className="text-blue-700 mb-6">Choose up to 5 authors whose works you like to read.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {popularAuthors.map(author => (
                <button
                  key={author.id}
                  onClick={() => handleAuthorToggle(author.id)}
                  className={`p-3 rounded-md border transition-colors ${
                    selectedAuthors.includes(author.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium shadow-sm'
                      : 'border-gray-300 hover:border-blue-300 text-gray-800 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="font-medium">{author.name}</span>
                  {selectedAuthors.includes(author.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-blue-600 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-blue-700 mb-8">
              Selected: {selectedAuthors.length}/5
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="btn-secondary px-6 py-2 bg-white hover:bg-gray-100 text-blue-700 font-medium rounded-full border border-blue-200 shadow-sm"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Reading Goals */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Set your reading goals</h2>
            <p className="text-blue-700 mb-8">How many books would you like to read this year?</p>
            
            <div className="max-w-md mx-auto mb-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-800 font-medium">Book Goal:</span>
                <span className="font-bold text-blue-700">{readingGoal} books</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="100"
                value={readingGoal}
                onChange={(e) => setReadingGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              
              <div className="flex justify-between text-xs text-blue-700 mt-1">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-sm text-blue-700 mb-4">Based on your goal, you&apos;ll need to read:</p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-blue-50 p-3 rounded-md text-center border border-blue-100 shadow-sm">
                  <div className="font-bold text-blue-700">{Math.round(readingGoal / 12)} books</div>
                  <div className="text-xs text-blue-700">per month</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-md text-center border border-blue-100 shadow-sm">
                  <div className="font-bold text-blue-700">{Math.round(readingGoal / 52)} books</div>
                  <div className="text-xs text-blue-700">per week</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-md text-center border border-blue-100 shadow-sm">
                  <div className="font-bold text-blue-700">{Math.round(readingGoal * 25)} pages</div>
                  <div className="text-xs text-blue-700">per week</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="btn-secondary px-6 py-2 bg-white hover:bg-gray-100 text-blue-700 font-medium rounded-full border border-blue-200 shadow-sm"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={isLoading}
                className="btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-sm flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting Up...
                  </>
                ) : (
                  "Finish Setup"
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 text-sm hover:text-blue-800 transition-colors font-medium underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
} 