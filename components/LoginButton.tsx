import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

const LoginButton = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4 font-mono text-sm">
        <span className="text-gray-600 tracking-wide">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="uppercase tracking-wider border-b-2 border-black hover:text-gray-600"
        >
          [Sign Out]
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="font-mono text-sm uppercase tracking-wider border-2 border-black px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      Sign In
    </button>
  );
};

export default LoginButton; 