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
  description: string | null;
};

export default function ShotDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [shot, setShot] = useState<Shot | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>('');

  // Ensure id is string before using in hrefs
  const shotId = typeof id === 'string' ? id : '';

  const fetchVideosWithVotes = async (shotId: string) => {
    try {
      const numericShotId = parseInt(shotId, 10);
      if (isNaN(numericShotId)) {
        throw new Error('Invalid shot ID');
      }

      const { data, error } = await supabase
        .rpc('get_videos_with_votes', { 
          shot_id_input: numericShotId,
        });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching videos:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!shotId) return;
      
      try {
        const { data: shotData, error: shotError } = await supabase
          .from('shots')
          .select('*')
          .eq('id', shotId)
          .single();

        if (shotError) throw shotError;
        if (!shotData) throw new Error('Shot not found');

        setShot(shotData);
        const videosData = await fetchVideosWithVotes(shotId);
        setVideos(videosData);
      } catch (err) {
        console.error('Error fetching shot:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch shot');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shotId]);

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
      const updatedVideos = await fetchVideosWithVotes(shotId);
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Error voting:', err);
      // Revert the optimistic update on error
      const updatedVideos = await fetchVideosWithVotes(shotId);
      setVideos(updatedVideos);
      alert('Failed to register vote. Please try again.');
    }
  };

  const handleDelete = async (video: Video) => {
    if (!user || user.id !== video.user_id) {
      alert('You can only delete your own videos');
      return;
    }

    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete the video record from the database
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      // Extract the file path from the video URL
      const urlParts = video.video_url.split('/');
      const filePath = urlParts[urlParts.length - 1];

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([`shot-${video.shot_id}/${video.user_id}/${filePath}`]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Don't throw here as the database record is already deleted
      }

      // Update the videos list
      const updatedVideos = await fetchVideosWithVotes(shotId);
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Failed to delete video. Please try again.');
    }
  };

  const handleEdit = async (video: Video) => {
    if (!user || user.id !== video.user_id) {
      alert('You can only edit your own videos');
      return;
    }

    setEditingVideoId(video.id);
    setEditedDescription(video.description || '');
  };

  const handleSaveEdit = async (video: Video) => {
    if (!user || user.id !== video.user_id) {
      alert('You can only edit your own videos');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('videos')
        .update({ description: editedDescription.trim() || null })
        .eq('id', video.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update the videos list
      const updatedVideos = await fetchVideosWithVotes(shotId);
      setVideos(updatedVideos);
      setEditingVideoId(null);
    } catch (err) {
      console.error('Error updating video:', err);
      alert('Failed to update video description. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingVideoId(null);
    setEditedDescription('');
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

  if (error || !shot) {
    return (
      <div className="min-h-screen bg-white p-8 font-mono">
        <div className="border-2 border-black p-4 max-w-2xl mx-auto">
          <div className="uppercase tracking-wider text-sm mb-2">[ERROR]</div>
          <div className="text-gray-800">{error || 'Shot not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      <Head>
        <title>Napoleon - Shot {shot.order_index}</title>
        <meta name="description" content={`Shot ${shot.order_index}: ${shot.title}`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Shot Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="border-b-2 border-gray-200 pb-8">
            <div className="text-center mb-8">
              <div className="uppercase tracking-wider text-sm mb-4">
                Shot {shot.order_index}
                <span className="text-xs text-gray-300 ml-2 font-light tracking-normal lowercase">
                  (id: {shot.id})
                </span>
              </div>
              <h1 className="text-2xl uppercase tracking-wide">
                {shot.title}
              </h1>
            </div>
            <p className="text-gray-600 whitespace-pre-line">
              {shot.script_excerpt}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Link
            href={`/shots/${shotId}/upload`}
            className="inline-block px-8 py-4 bg-black text-white font-mono uppercase tracking-wider text-sm hover:bg-gray-900 transition-colors border-2 border-black"
          >
            [Submit Your Version]
          </Link>
        </div>

        {/* Community Submissions */}
        <div className="max-w-4xl mx-auto">
          <div className="uppercase tracking-wider text-sm mb-8 text-center">
            [Community Interpretations]
          </div>

          {videos.length === 0 ? (
            <div className="py-12 border-2 border-black">
              <p className="text-gray-600 uppercase tracking-wider text-sm px-6">
                [No Videos Uploaded Yet]
              </p>
              {user && (
                <p className="mt-4 text-sm px-6">
                  Be the first to recreate this shot!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  className="border-t-2 border-gray-200 pt-8"
                >
                  <div className="flex flex-col-reverse sm:flex-row gap-8 items-start sm:items-center min-h-[300px]">
                    {/* Video Info */}
                    <div className="flex-1">
                      <div className="uppercase tracking-wider text-sm mb-2">
                        Director: {video.user_email || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {new Date(video.created_at).toLocaleDateString()}
                      </div>
                      {video.description && editingVideoId !== video.id && (
                        <div className="mb-6">
                          <div className="uppercase tracking-wider text-sm mb-2">[Director&apos;s Notes]</div>
                          <p className="text-gray-600 whitespace-pre-line">
                            {video.description}
                          </p>
                        </div>
                      )}
                      {editingVideoId === video.id && (
                        <div className="mb-6">
                          <div className="uppercase tracking-wider text-sm mb-2">[Edit Director&apos;s Notes]</div>
                          <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Share your thoughts about your interpretation..."
                            className="w-full h-32 p-4 border-2 border-black font-mono text-sm resize-none focus:outline-none mb-4"
                          />
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleSaveEdit(video)}
                              className="text-sm uppercase tracking-wider border-2 border-black bg-black text-white px-4 py-2 hover:bg-gray-900"
                            >
                              [Save]
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-sm uppercase tracking-wider border-2 border-black text-black px-4 py-2 hover:bg-gray-50"
                            >
                              [Cancel]
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleVote(video.id)}
                            className={`text-sm uppercase tracking-wider border-2 px-4 py-2 ${
                              !user 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : video.has_voted
                                  ? 'border-black bg-black text-white'
                                  : 'border-black text-black hover:bg-gray-50'
                            }`}
                            disabled={!user}
                            title={user ? (video.has_voted ? 'Remove upvote' : 'Upvote this interpretation') : 'Sign in to upvote'}
                          >
                            {video.has_voted ? '[Remove Upvote]' : '[Upvote]'}
                          </button>
                          <div className="text-sm text-gray-600 uppercase tracking-wider">
                            {video.votes_count || 0} {video.votes_count === 1 ? 'upvote' : 'upvotes'}
                          </div>
                        </div>
                        {user && user.id === video.user_id && (
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleEdit(video)}
                              className="text-sm uppercase tracking-wider border-2 border-black text-black px-4 py-2 hover:bg-gray-50"
                              title="Edit your video description"
                              disabled={editingVideoId === video.id}
                            >
                              [Edit]
                            </button>
                            <button
                              onClick={() => handleDelete(video)}
                              className="text-sm uppercase tracking-wider border-2 border-red-500 text-red-500 px-4 py-2 hover:bg-red-50"
                              title="Delete your video"
                            >
                              [Delete]
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Player */}
                    <div className="w-full sm:w-80 flex-shrink-0 mb-4 sm:mb-0">
                      <div className="bg-black rounded-none overflow-hidden border-2 border-black">
                        <video 
                          src={video.video_url} 
                          controls 
                          className="w-full aspect-video"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 