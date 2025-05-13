# BookTok - Social Network for Book Lovers

BookTok is a modern social networking platform for book lovers, combining Instagram-like social features with Goodreads-style book tracking functionality.

## Features

### Core Features
- **User Authentication**: Login and registration with mock functionality
- **User Profiles**: Customizable user information and bookshelves
- **Bookshelf Management**: Organize books into different collections (Currently Reading, Read, Want to Read, Favorites)
- **Dashboard**: Track reading progress and get personalized book recommendations
- **Onboarding Flow**: Genre selection and reading goals for new users

### Social Features
- **Home Feed**: Infinite scroll feed of bookish content (photos, videos, reviews, quotes)
- **Post Interactions**: Like, comment, share, and bookmark functionality
- **Microblog**: Twitter/Threads-like short-form updates for sharing thoughts about books
- **Content Creation**: Tools for uploading photos/videos, adding quotes, writing reviews

### Book Discovery
- **Book Pages**: Dedicated pages with cover, synopsis, author info, ratings, reviews
- **Book Discovery**: Trending books, genre browsing, and curated lists
- **AI Recommendations**: Personalized book suggestions based on reading habits

## Technologies Used
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

## Project Structure
- `/app`: Main application pages using Next.js app router
  - `/feed`: Social media feed with infinite scroll
  - `/microblog`: Short-form text updates like Twitter/Threads
  - `/book`: Individual book details pages
  - `/books`: Book discovery and browsing
  - `/create-post`: Post creation with various content types
  - `/bookshelf`: User's personal book collections
  - `/profile`: User profile page
  - `/dashboard`: User homepage with activity and recommendations
  - `/onboarding`: New user setup experience
  - `/login` & `/register`: Authentication pages
- `/components`: Reusable UI components
  - `Header.tsx`: Main navigation header
  - `Footer.tsx`: Site footer with links
  - `MobileNavBar.tsx`: Bottom navigation for mobile
  - `StoriesBar.tsx`: Stories/highlights component
  - `ThemeToggle.tsx` & `ThemeProvider.tsx`: Dark/light mode support

## Setup and Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Mock Data
The app uses mock data for demonstration purposes. In a production environment, these would be replaced with API calls to a backend service.

## Future Enhancements
- Backend integration with user authentication
- Real-time notifications
- Advanced search functionality
- Reading challenges and achievements
- Book clubs and group discussions
- Integration with book retailer APIs

## License

MIT 