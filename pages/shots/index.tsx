import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
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

export default function ShotsPage() {
  const [shots, setShots] = useState<ShotWithVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShots = async () => {
      try {
        const { data, error } = await supabase.rpc('get_shots_with_top_videos');
        
        if (error) throw error;
        
        setShots(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shots');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShots();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 uppercase tracking-wider text-sm">[Loading Shots...]</p>
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

  return (
    <div className="min-h-screen bg-white font-mono">
      <Head>
        <title>Napoleon - All Shots</title>
        <meta name="description" content="Complete script breakdown of Napoleon" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="uppercase tracking-wider text-sm mb-4">Shot Breakdown</div>
          <h1 className="text-2xl uppercase tracking-wide mb-2">Napoleon</h1>
          <div className="text-gray-600">Complete Screenplay</div>
        </div>

        <div className="max-w-4xl mx-auto">
          {shots.map((shot, index) => (
            <div 
              key={shot.id}
              className="border-t-2 border-gray-200 py-8"
            >
              <div className="flex flex-col-reverse sm:flex-row gap-8 items-start sm:items-center min-h-[300px]">
                {/* Text Content */}
                <div className="flex-1">
                  <div className="uppercase tracking-wider text-sm mb-2">
                    Shot {index + 1}
                    <span className="text-xs text-gray-300 ml-2 font-light tracking-normal lowercase">
                      (id: {shot.id})
                    </span>
                  </div>
                  <h2 className="text-xl uppercase tracking-wide mb-4">
                    {shot.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {shot.script_excerpt}
                  </p>
                  <Link 
                    href={`/shots/${shot.id}`}
                    className="inline-block text-sm uppercase tracking-wider text-black hover:text-gray-600"
                  >
                    [View All Submissions And Submit Your Own →]
                  </Link>
                </div>

                {/* Video Section */}
                <div className="w-full sm:w-80 flex-shrink-0 mb-4 sm:mb-0">
                  <div className="bg-black rounded-none overflow-hidden border-2 border-black">
                    {shot.top_video_url ? (
                      <video
                        src={shot.top_video_url}
                        controls
                        className="w-full aspect-video"
                      />
                    ) : (
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-600 uppercase tracking-wider text-sm">[No Video Uploaded Yet]</p>
                      </div>
                    )}
                  </div>
                  {shot.top_video_user_id && (
                    <div className="mt-2 text-sm text-gray-600 uppercase tracking-wider">
                      Director: {shot.top_video_user_email || 'Anonymous'} 
                      {shot.top_video_votes !== null && (
                        <span className="ml-2">
                          [{shot.top_video_votes} votes]
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="border-t-2 border-gray-200"></div>
        </div>
      </main>
    </div>
  );
} 