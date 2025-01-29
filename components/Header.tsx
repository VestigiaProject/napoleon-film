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
              Scenes
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
              Scenes
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