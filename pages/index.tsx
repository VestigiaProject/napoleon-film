import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import LoginButton from '../components/LoginButton'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabaseClient'

const Home: NextPage = () => {
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Napoleon Film Project</title>
        <meta name="description" content="A community-driven Napoleon film project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to Napoleon Film Project
        </h1>
        
        <div className="mb-8">
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            <div>
              <p className="mb-4">Signed in as: {user.email}</p>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href="/shots"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
          >
            View All Shots
          </Link>

          <Link
            href="/film"
            className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center"
          >
            Watch Full Film
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home 