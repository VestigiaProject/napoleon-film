import Link from 'next/link';
import { useRouter } from 'next/router';
import LoginButton from './LoginButton';

export default function Header() {
  const router = useRouter();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 font-mono">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-lg uppercase tracking-widest font-medium">
              NAPOLEON
            </Link>
            <nav className="flex space-x-6 uppercase text-sm tracking-wider">
              <Link 
                href="/film" 
                className={`${
                  router.pathname === '/film' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Full Film
              </Link>
              <Link 
                href="/shots" 
                className={`${
                  router.pathname.startsWith('/shots')
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Scenes
              </Link>
              <Link 
                href="/about" 
                className={`${
                  router.pathname === '/about'
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
} 