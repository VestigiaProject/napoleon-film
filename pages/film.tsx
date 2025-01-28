import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Head from 'next/head';
import Link from 'next/link';

type ShotWithVideo = {
  id: number;
  title: string;
  script_excerpt: string;
  order_index: number;
  created_at: string;
  top_video_url: string | null;
  top_video_user_id: string | null;
  top_video_user_email: string | null;
  top_video_votes: number | null;
};

export default function Film() {
  const [shots, setShots] = useState<ShotWithVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchShots = async () => {
      try {
        console.log('Fetching shots...');
        const { data, error } = await supabase.rpc('get_shots_with_top_videos');
        
        if (error) {
          console.error('Error fetching shots:', error);
          throw error;
        }
        
        if (!data) {
          console.warn('No shots data returned');
          setShots([]);
        } else {
          console.log(`Successfully fetched ${data.length} shots`);
          setShots(data);
        }
      } catch (err) {
        console.error('Error in fetchShots:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch shots');
      } finally {
        setLoading(false);
      }
    };

    fetchShots();
  }, []);

  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentIndex, autoplay]);

  const handleVideoEnd = () => {
    if (autoplay && currentIndex < shots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < shots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading film...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600 max-w-2xl mx-auto">
          {error}
        </div>
      </div>
    );
  }

  const currentShot = shots[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Watch Napoleon - Community Film Project</title>
        <meta name="description" content="Watch the community-created Napoleon film" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/"
            className="text-gray-400 hover:text-white font-medium"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`px-4 py-2 rounded ${
                autoplay 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {autoplay ? 'Disable' : 'Enable'} Autoplay
            </button>
            <span className="text-gray-400">
              Shot {currentIndex + 1} of {shots.length}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            {currentShot.top_video_url ? (
              <video
                ref={videoRef}
                src={currentShot.top_video_url}
                controls
                className="w-full aspect-video"
                onEnded={handleVideoEnd}
              />
            ) : (
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">No video available for this shot</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {currentShot.title}
            </h2>
            <p className="text-gray-300 whitespace-pre-line">
              {currentShot.script_excerpt}
            </p>
            {currentShot.top_video_user_id && (
              <p className="mt-4 text-sm text-gray-400">
                Top video by: {currentShot.top_video_user_email || 'Anonymous'} 
                {currentShot.top_video_votes ? ` (${currentShot.top_video_votes} votes)` : ' (0 votes)'}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-lg ${
                currentIndex === 0
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              ← Previous Shot
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === shots.length - 1}
              className={`px-6 py-3 rounded-lg ${
                currentIndex === shots.length - 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Next Shot →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 