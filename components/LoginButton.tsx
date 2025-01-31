import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { useState, useRef, useEffect } from 'react';

const LoginButton = () => {
  const { user } = useAuth();
  const [showProviders, setShowProviders] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProviders(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async (provider: 'google' | 'discord') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      setShowProviders(false);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProviders(!showProviders);
  };

  const handleProviderClick = (e: React.MouseEvent, provider: 'google' | 'discord') => {
    e.stopPropagation();
    handleSignIn(provider);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4 font-mono text-sm" onClick={(e) => e.stopPropagation()}>
        <span className="text-gray-600 tracking-wide">
          [{user.email}]
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSignOut();
          }}
          className="uppercase tracking-wider border-b-2 border-black hover:text-gray-600"
        >
          [Sign Out]
        </button>
      </div>
    );
  }

  return (
    <div className="relative sm:block" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleSignInClick}
        className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black"
      >
        [Sign In]
      </button>
      
      {showProviders && (
        <div className="sm:absolute sm:right-0 sm:mt-2 py-2 w-full sm:w-48 bg-white sm:border-2 sm:border-black sm:shadow-lg z-50 space-y-2 sm:space-y-0">
          <button
            onClick={(e) => handleProviderClick(e, 'google')}
            className="block w-full text-left px-4 py-2 text-sm font-mono uppercase tracking-wider hover:bg-gray-50"
          >
            With Google
          </button>
          <button
            onClick={(e) => handleProviderClick(e, 'discord')}
            className="block w-full text-left px-4 py-2 text-sm font-mono uppercase tracking-wider hover:bg-gray-50"
          >
            With Discord
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginButton; 