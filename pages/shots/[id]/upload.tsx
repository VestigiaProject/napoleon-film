import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function UploadVideoPage() {
  const router = useRouter();
  const { id: shotId } = router.query;
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File size must be less than 100MB');
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        throw new Error('File must be a video');
      }

      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `shot-${shotId}/${user?.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Insert into videos table
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          shot_id: shotId,
          user_id: user?.id,
          video_url: publicUrlData.publicUrl,
        });

      if (dbError) throw dbError;

      // Redirect back to shot detail page
      router.push(`/shots/${shotId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please sign in to upload videos.</p>
          <Link 
            href={`/shots/${shotId}`}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Shot
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Upload Video - Napoleon Film Project</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <Link 
              href={`/shots/${shotId}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Shot
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Your Video
            </h1>

            <div className="space-y-4">
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`w-full py-3 px-4 border-2 border-dashed rounded-lg text-center ${
                  uploading
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {uploading ? (
                  <span className="text-gray-500">Uploading...</span>
                ) : (
                  <span className="text-blue-600">
                    Click to select a video file
                  </span>
                )}
              </button>

              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {progress}% uploaded
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <p>Requirements:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Maximum file size: 100MB</li>
                  <li>Supported formats: MP4, WebM, MOV</li>
                  <li>Recommended resolution: 1080p or higher</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 