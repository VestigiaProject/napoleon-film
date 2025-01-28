import { supabase } from '../lib/supabaseClient';

const LoginButton = () => {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error:', error.message);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-100 flex items-center"
    >
      <img
        src="/google-icon.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      Sign in with Google
    </button>
  );
};

export default LoginButton; 