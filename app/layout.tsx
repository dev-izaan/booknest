import './globals.css';
import { Inter, Merriweather } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FirebaseProvider } from '@/contexts/FirebaseContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata = {
  title: 'BookTok - The Social Home for Book Lovers',
  description: 'Connect with book lovers, share your reading journey, and discover new books.',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <FirebaseProvider>
            <div className="page-wrapper">
              <Header />
              <main className="flex-grow pt-[var(--nav-height)] md:pt-0 pb-16 md:pb-0 page-transition-enter-active">
                {children}
              </main>
              <Footer className="hidden md:block" />
            </div>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 