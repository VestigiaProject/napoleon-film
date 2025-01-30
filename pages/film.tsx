import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Head from 'next/head';
import type { NextPage } from 'next';
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

const Film: NextPage = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 uppercase tracking-wider text-sm">[Loading Shot...]</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8 font-mono">
        <div className="border-2 border-black p-4 max-w-2xl mx-auto">
          <div className="uppercase tracking-wider text-sm mb-2">[ERROR]</div>
          <div className="text-gray-800">{error}</div>
        </div>
      </div>
    );
  }

  const currentShot = shots[currentIndex];

  return (
    <div className="min-h-screen bg-white font-mono">
      <Head>
        <title>Napoleon - Shot {currentIndex + 1}</title>
        <meta name="description" content="Napoleon Film Project" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="uppercase tracking-wider text-sm mb-4">Full Film</div>
          <h1 className="text-2xl uppercase tracking-wide mb-2">Napoleon</h1>
          <div className="text-gray-600">Watch the community&apos;s highest voted interpretations of each shot in sequence.</div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Autoplay Control */}
          <div className="mb-4 flex justify-end">
            <div className="w-80 flex items-center justify-between">
              <button
                onClick={() => setAutoplay(!autoplay)}
                className={`px-4 py-2 text-sm uppercase tracking-wider border-2 ${
                  autoplay 
                    ? 'border-black bg-black text-white' 
                    : 'border-black text-black hover:bg-gray-50'
                }`}
              >
                {autoplay ? '[Stop Autoplay]' : '[Start Autoplay]'}
              </button>
              <span className="text-sm uppercase tracking-wider">
                Shot {currentIndex + 1} of {shots.length}
              </span>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-none overflow-hidden border-2 border-black">
            {currentShot.top_video_url ? (
              <video
                ref={videoRef}
                src={currentShot.top_video_url}
                controls
                className="w-full aspect-video"
                onEnded={handleVideoEnd}
              />
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600 uppercase tracking-wider text-sm">[No Video Uploaded Yet]</p>
              </div>
            )}
          </div>

          {/* Shot Navigation */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  className="px-4 py-2 text-sm uppercase tracking-wider border-2 border-black text-black hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
                  disabled={currentIndex === 0}
                >
                  [Previous]
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(shots.length - 1, currentIndex + 1))}
                  className="px-4 py-2 text-sm uppercase tracking-wider border-2 border-black text-black hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
                  disabled={currentIndex === shots.length - 1}
                >
                  [Next]
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm uppercase tracking-wider">Go to Shot:</span>
                <input
                  type="number"
                  min={1}
                  max={shots.length}
                  value={currentIndex + 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= shots.length) {
                      setCurrentIndex(value - 1);
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border-2 border-black font-mono text-center"
                />
                <span className="text-sm text-gray-600 uppercase tracking-wider">
                  of {shots.length}
                </span>
              </div>
            </div>
          </div>

          {/* Shot Description */}
          <div className="mt-8 border-t-2 border-gray-200 py-8">
            <div className="uppercase tracking-wider text-sm mb-2">Shot Description:</div>
            <h2 className="text-xl uppercase tracking-wide mb-4">
              {currentShot.title}
            </h2>
            <div className="whitespace-pre-line text-gray-800 mb-6">
              {currentShot.script_excerpt}
            </div>
            {currentShot.top_video_user_id && (
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Director: {currentShot.top_video_user_email || 'Anonymous'} 
                {currentShot.top_video_votes !== null && (
                  <span className="ml-2">
                    [{currentShot.top_video_votes} votes]
                  </span>
                )}
              </div>
            )}

            {/* View Shot Details Button */}
            <div className="mt-8 text-center">
              <Link
                href={`/shots/${currentShot.id}`}
                className="inline-block px-8 py-3 text-sm uppercase tracking-wider border-2 border-black text-black hover:bg-gray-50"
              >
                [View All Submissions For This Shot Or Submit Your Own]
              </Link>
            </div>

            <p className="text-gray-600 mb-4">
              Let&apos;s recreate this shot together!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Film; 