import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';

type Shot = {
  id: number;
  title: string;
  script_excerpt: string;
  order_index: number;
  created_at: string;
};

type Video = {
  id: number;
  shot_id: number;
  video_url: string;
  user_id: string;
  user_email: string;
  created_at: string;
  votes_count: number;
  has_voted?: boolean;
};

export default function ShotDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [shot, setShot] = useState<Shot | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideosWithVotes = async (shotId: string | number) => {
    console.log('Fetching videos for shot:', shotId);
    try {
      const numericShotId = Number(shotId);
      if (isNaN(numericShotId)) {
        throw new Error('Invalid shot ID');
      }

      const { data, error } = await supabase
        .rpc('get_videos_with_votes', { 
          shot_id_input: numericShotId 
        });
      
      if (error) {
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error('Error in fetchVideosWithVotes:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        console.log('Fetching shot with ID:', id);
        
        // Fetch shot details
        const { data: shotData, error: shotError } = await supabase
          .from('shots')
          .select('*')
          .eq('id', id)
          .single();

        if (shotError) throw shotError;
        if (!shotData) throw new Error(`Shot not found with ID: ${id}`);

        setShot(shotData);

        // Fetch videos with vote counts
        const videosData = await fetchVideosWithVotes(id);
        setVideos(videosData);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch shot data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleVote = async (videoId: number) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      // Optimistically update the UI
      setVideos(currentVideos => 
        currentVideos.map(video => {
          if (video.id === videoId) {
            const newHasVoted = !video.has_voted;
            return {
              ...video,
              has_voted: newHasVoted,
              votes_count: video.votes_count + (newHasVoted ? 1 : -1)
            };
          }
          return video;
        })
      );

      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .single();

      const { error: mutationError } = existingVote
        ? await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id)
            .eq('user_id', user.id)
        : await supabase
            .from('votes')
            .insert([{ 
              video_id: videoId, 
              user_id: user.id,
              created_at: new Date().toISOString()
            }]);

      if (mutationError) throw mutationError;

      // Refresh videos to get the accurate count
      const updatedVideos = await fetchVideosWithVotes(id);
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Error voting:', err);
      // Revert the optimistic update on error
      const updatedVideos = await fetchVideosWithVotes(id);
      setVideos(updatedVideos);
      alert('Failed to register vote. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shot details...</p>
        </div>
      </div>
    );
  }

  if (error || !shot) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600 max-w-2xl mx-auto">
          {error || 'Shot not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{shot.title} - Napoleon Film Project</title>
        <meta name="description" content={`Shot ${shot.order_index}: ${shot.title}`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/shots"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Shots
          </Link>
          <span className="text-sm text-gray-500">
            Shot #{shot.order_index}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{shot.title}</h1>
          <p className="text-gray-600 whitespace-pre-line text-lg">
            {shot.script_excerpt}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Videos</h2>
          {videos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No videos uploaded yet for this shot.</p>
              {user && (
                <p className="mt-4 text-blue-600">
                  Be the first to contribute a video!
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <video 
                      src={video.video_url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Uploaded by: {video.user_email || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleVote(video.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors duration-200 ${
                          user 
                            ? video.has_voted
                              ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                              : 'hover:bg-gray-100'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!user}
                        title={user ? (video.has_voted ? 'Remove vote' : 'Add vote') : 'Sign in to vote'}
                      >
                        <span>{video.has_voted ? '👍' : '👆'}</span>
                        <span>{video.votes_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <div className="fixed bottom-8 right-8">
            <Link
              href={`/shots/${id}/upload`}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Upload Video</span>
              <span>+</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 