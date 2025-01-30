import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo - Always visible */}
          <Link
            href="/"
            className="text-black font-mono uppercase tracking-wider text-sm"
          >
            Napoleon
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-8">
            <Link
              href="/film"
              className={`${
                router.pathname === '/film' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-600 hover:text-black'
              } font-mono text-sm uppercase tracking-wider`}
            >
              Full Film
            </Link>
            <Link
              href="/shots"
              className={`${
                router.pathname.startsWith('/shots') 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-600 hover:text-black'
              } font-mono text-sm uppercase tracking-wider`}
            >
              Shots
            </Link>
            <Link
              href="/about"
              className={`${
                router.pathname === '/about' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-600 hover:text-black'
              } font-mono text-sm uppercase tracking-wider`}
            >
              About
            </Link>
            <a
              href="https://discord.gg/FeJz9gtXF4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            {user && (
              <div className="font-mono text-sm uppercase tracking-wider text-gray-600">
                [{user.email}]
              </div>
            )}
            <button
              onClick={async () => {
                if (user) {
                  await signOut();
                } else {
                  await signIn();
                }
              }}
              className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black"
            >
              {user ? '[Sign Out]' : '[Sign In]'}
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="space-y-2">
              <span className={`block w-8 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="py-4 space-y-4">
            <Link
              href="/film"
              className={`block font-mono text-sm uppercase tracking-wider ${
                router.pathname === '/film' 
                  ? 'text-black' 
                  : 'text-gray-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Full Film
            </Link>
            <Link
              href="/shots"
              className={`block font-mono text-sm uppercase tracking-wider ${
                router.pathname.startsWith('/shots') 
                  ? 'text-black' 
                  : 'text-gray-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shots
            </Link>
            <Link
              href="/about"
              className={`block font-mono text-sm uppercase tracking-wider ${
                router.pathname === '/about' 
                  ? 'text-black' 
                  : 'text-gray-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <button
              onClick={async () => {
                if (user) {
                  await signOut();
                } else {
                  await signIn();
                }
                setIsMenuOpen(false);
              }}
              className="block w-full text-left font-mono text-sm uppercase tracking-wider text-gray-600"
            >
              {user ? '[Sign Out]' : '[Sign In]'}
            </button>
            {user && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 uppercase tracking-wider">
                  [{user.email}]
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 