import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const UploadPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('File must be a video');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Generate a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `shot-${id}/${user?.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          onUploadProgress: (event) => {
            const percent = (event.loaded / event.total) * 100;
            setProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData, error: urlError } = await supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      // Create video record in database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          shot_id: id,
          user_id: user?.id,
          video_url: publicUrlData.publicUrl,
          description: description.trim() || null,
        });

      if (dbError) throw dbError;

      // Redirect back to shot detail page
      router.push(`/shots/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="uppercase tracking-wider text-sm">[Authentication Required]</div>
          <p className="text-gray-600">Please sign in to upload videos.</p>
          <Link 
            href={`/shots/${id}`}
            className="inline-block mt-4 px-6 py-3 text-sm uppercase tracking-wider border-2 border-black hover:bg-gray-50"
          >
            [Back to Scene]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      <Head>
        <title>Submit Your Scene - Napoleon Film Project</title>
        <meta name="description" content="Upload your interpretation of the scene" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link 
              href={`/shots/${id}`}
              className="text-sm uppercase tracking-wider text-gray-600 hover:text-black"
            >
              [← Back to Scene]
            </Link>
            <div className="mt-8">
              <div className="uppercase tracking-wider text-sm mb-4">Scene Submission</div>
              <h1 className="text-2xl uppercase tracking-wide mb-4">
                Your Interpretation
              </h1>
            </div>
          </div>

          {/* Upload Section */}
          <div className="border-2 border-black p-8">
            <div className="text-center">
              <div className="uppercase tracking-wider text-sm mb-8">[Director's Cut]</div>
              
              {/* Description Field */}
              <div className="mb-8">
                <div className="uppercase tracking-wider text-sm mb-4">[Director's Notes]</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your thoughts about your interpretation..."
                  className="w-full h-32 p-4 border-2 border-black font-mono text-sm resize-none focus:outline-none"
                  disabled={uploading}
                />
              </div>

              {/* Video Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-none p-12 hover:border-black transition-colors cursor-pointer"
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <div className="space-y-4">
                  <div className="uppercase tracking-wider text-sm">
                    {uploading ? '[Uploading...]' : selectedFile ? `[Selected: ${selectedFile.name}]` : '[Click to Select a Video File]'}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/mp4,video/webm,video/mov"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  {uploading && (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 uppercase tracking-wider">
                        [{progress}% uploaded]
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="text-sm text-red-600 uppercase tracking-wider">
                      [Error: {error}]
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm text-gray-600">
                <div className="uppercase tracking-wider">[Requirements]</div>
                <div className="space-y-2">
                  <p>• Maximum file size: 100MB</p>
                  <p>• Supported formats: MP4, WebM, MOV</p>
                  <p>• Recommended resolution: 1080p or higher</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href={`/shots/${id}`}
              className="px-6 py-3 text-sm uppercase tracking-wider border-2 border-black hover:bg-gray-50"
            >
              [Cancel]
            </Link>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className={`px-6 py-3 text-sm uppercase tracking-wider border-2 border-black ${
                uploading || !selectedFile
                  ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {uploading ? '[Uploading...]' : '[Submit Scene]'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage; 