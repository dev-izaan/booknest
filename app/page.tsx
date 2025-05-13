import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/book-pattern.svg')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Welcome to BookTok
            </h1>
            <p className="text-xl mb-8">
              The social home for book lovers. Share your reading journey, discover new books, 
              and connect with a community that shares your passion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary bg-white text-[var(--primary-dark)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]">
                Join BookTok
              </Link>
              <Link href="/login" className="btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Why Join BookTok?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card animate-bookOpen" style={{animationDelay: '0.1s'}}>
              <div className="text-[var(--accent-color)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Track Your Reading</h3>
              <p className="text-[var(--primary-dark)]">
                Keep track of your reading history, current books, and wishlist all in one place.
              </p>
            </div>
            <div className="card animate-bookOpen" style={{animationDelay: '0.2s'}}>
              <div className="text-[var(--accent-color)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Connect With Others</h3>
              <p className="text-[var(--primary-dark)]">
                Find and connect with friends and readers who share your literary interests.
              </p>
            </div>
            <div className="card animate-bookOpen" style={{animationDelay: '0.3s'}}>
              <div className="text-[var(--accent-color)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Share Your Thoughts</h3>
              <p className="text-[var(--primary-dark)]">
                Write reviews, share quotes, and discuss your favorite books with the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Highlights Section */}
      <section className="py-16 bg-[var(--primary-light)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Popular on BookTok</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                <div className="relative rounded-md overflow-hidden h-64 shadow-xl">
                  <Image 
                    src={`https://picsum.photos/id/${20+i}/200/300`} 
                    alt="Book cover" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 text-white w-full">
                    <h3 className="font-serif font-bold truncate">Popular Book Title {i}</h3>
                    <p className="text-xs text-white/80">Author Name</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--card-bg)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Ready to Start Your Reading Journey?</h2>
          <Link href="/register" className="btn-primary inline-block">
            Join BookTok Today
          </Link>
        </div>
      </section>
    </div>
  );
} 