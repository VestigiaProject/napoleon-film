import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Shot = {
  id: number;
  title: string;
  script_excerpt: string;
  order_index: number;
  created_at: string;
};

export default function ShotsPage() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShots = async () => {
      try {
        const { data: shotsData, error: supabaseError } = await supabase
          .from('shots')
          .select('*')
          .order('order_index');
        
        if (supabaseError) throw supabaseError;
        
        setShots(shotsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shots');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShots();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Napoleon Film Project - Shots</title>
        <meta name="description" content="List of shots from Napoleon film script" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Napoleon Film Shots</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shots...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            {error}
          </div>
        ) : shots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No shots available yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {shots.map((shot) => (
              <Link 
                href={`/shots/${shot.id}`} 
                key={shot.id}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {shot.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      Shot #{shot.order_index}
                    </span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-line">
                    {shot.script_excerpt}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-600 text-sm">View details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 